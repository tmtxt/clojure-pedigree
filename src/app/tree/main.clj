(ns app.tree.main
  (:require [app.models.person :as person]
            [app.util.neo4j.command :as ncm]
            [com.rpl.specter :refer :all]))

(def ^{:private true} default-depth 5)

(defn- recur-fn [path tree assoc-path]
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
        (recur children-path tree child-assoc-path))
      tree)))

(defn- extract-tree [paths]
  (let [reduce-fn (fn [tree link]
               (recur-fn link tree []))
        tree (reduce reduce-fn {} paths)]
    (clojure.pprint/pprint tree)
    ))

(defn- get-tree-from-node [root & [depth]]
  (let [rows (ncm/query-tree (:user_id root) depth)
        paths (map (fn [[path]] path) rows)]
    (extract-tree paths)))

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
