(ns app.tree.main
  (:require [app.models.person :as person]
            [app.util.neo4j.command :as ncm]
            [com.rpl.specter :refer :all]))

(def ^{:private true} default-depth 5)

;;; expect the path to be a vector of ids from the root to that node
;;; eg [1 2 3]
(defn- recur-fn [path tree assoc-path last-marriage]
  (let [children-path (rest path)
        continue (not (empty? children-path))
        user-id (first path)
        tree (assoc-in tree (conj assoc-path :user-id) user-id)]
    (if continue
      (let [children (get-in tree (conj assoc-path :children) [])
            child-id (second path)
            child-set (filter (fn [child] (= (:user-id child) child-id)) children)
            child (if (empty? child-set) {} (first child-set))
            idx (if (empty? child-set) (count children) (.indexOf children child))
            child-assoc-path (conj assoc-path :children idx)
            tree (if (empty? children) (assoc-in tree (conj assoc-path :children) children) tree)]
        (recur children-path tree child-assoc-path last-marriage))
      (assoc-in tree (conj assoc-path :marriage) last-marriage))))

;;; expect rows to be in a form of vector of vector
;;; each child vector is the path of user id from root node to that node
(defn- extract-tree [rows init-tree]
  (let [reduce-fn (fn [tree row]
                    (let [[path marriage] row]
                      (recur-fn path tree [] marriage)))
        tree (reduce reduce-fn init-tree rows)]
    tree))

(defn- reduce-fn [ids row]
  (let [[path marriage] row
        ids (apply conj ids path)
        ids (apply conj ids marriage)]
    ids))

(defn- extract-ids [rows]
  (let [reduce-fn (fn [ids row]
                    (let [[path marriage] row
                          ids (apply conj ids path)
                          ids (apply conj ids marriage)]
                      ids))
        ids (reduce reduce-fn #{} rows)]
    ids))

(defn- get-tree-from-node [root & [depth]]
  (let [rows (ncm/query-tree (:user_id root) depth)
        paths (map (fn [[path _ marriage]] [path marriage]) rows)
        ids (extract-ids paths)
        init-tree root]
    (extract-tree paths init-tree)))

(defn get-tree
  "Get tree from user id"
  ([]
   (let [root-node (person/find-root-node)]
     (get-tree-from-node root-node default-depth)))

  ([user-id]
   (let [root-node (person/find-node-by-user-id user-id)]
     (get-tree-from-node root-node default-depth)))

  ([user-id & {:keys [depth]
               :or [depth default-depth]}]
   (let [root-node (person/find-node-by-user-id user-id)]
     (get-tree-from-node root-node depth))))
