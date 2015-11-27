(ns app.tree.main
  (:require [app.models.person :as person]
            [app.neo4j.main :as neo4j]
            [app.neo4j.query :as query]
            [com.rpl.specter :refer :all]
            [slingshot.slingshot :refer [try+ throw+]]))

(def ^{:private true} default-depth 5)

(defn- query-tree
  "Query tree using Neo4j"
  [root-id depth]
  (let [result (neo4j/execute-statement query/get-tree root-id depth)
        data (-> result first :data)
        rows (map #(:row %) data)]
    rows))

(defn- extract-marriage-info [marriage person-info]
  (map #(get person-info %) marriage))

;;; expect the path to be a vector of ids from the root to that node
;;; eg [1 2 3]
(defn- recur-fn [path tree assoc-path last-marriage person-info last-order]
  (let [children-path (rest path)
        continue (not (empty? children-path))
        user-id (first path)
        tree (assoc-in tree (conj assoc-path :person-id) user-id)]
    (if continue
      (let [children (get-in tree (conj assoc-path :children) [])
            child-id (second path)
            child-set (filter (fn [child] (= (:person-id child) child-id)) children)
            child (if (empty? child-set) {} (first child-set))
            idx (if (empty? child-set) (count children) (.indexOf children child))
            child-assoc-path (conj assoc-path :children idx)
            tree (if (empty? children) (assoc-in tree (conj assoc-path :children) children) tree)]
        (recur children-path tree child-assoc-path last-marriage person-info last-order))
      (let [marriage-info (extract-marriage-info last-marriage person-info)
            tree (assoc-in tree (conj assoc-path :marriage) marriage-info)
            person-detail (get person-info user-id)
            tree (assoc-in tree (conj assoc-path :info) person-detail)
            tree (assoc-in tree (conj assoc-path :child-order) last-order)]
        tree))))

;;; expect rows to be in a form of vector of vector
;;; each child vector is the path of user id from root node to that node
(defn- extract-tree [rows init-tree person-info]
  (let [reduce-fn (fn [tree row]
                    (let [[path marriage last-order] row]
                      (recur-fn path tree [] marriage person-info last-order)))
        tree (reduce reduce-fn init-tree rows)]
    tree))

(defn- extract-ids [rows]
  (let [reduce-fn (fn [ids row]
                    (let [[path marriage] row
                          ids (apply conj ids path)
                          ids (apply conj ids marriage)]
                      ids))
        ids (reduce reduce-fn #{} rows)]
    ids))

(defn- extract-person-info [rows]
  (let [reduce-fn (fn [person-info person]
                    (assoc person-info (:id person) person))
        person-info (reduce reduce-fn {} rows)]
    person-info))

(defn- get-tree-from-node [root & [depth]]
  (let [rows (query-tree (:person-id root) depth)
        paths (map (fn [[path _ marriage last_order]] [path marriage last_order]) rows)
        ids (extract-ids paths)
        person-rows (person/find-entities-by-ids ids :json-friendly true)
        person-info (extract-person-info person-rows)
        init-tree root
        ]
    (extract-tree paths init-tree person-info)
    ))

(defn- find-root [person-id]
  (let [find-root (person/find-person-by {:id person-id}
                                         :include-node true
                                         :include-partners true
                                         :json-friendly true)
        root-entity (:entity find-root)
        result (if (empty? root-entity)
                 (person/find-root :include-node true :include-partners true :json-friendly true)
                 find-root)]
    result))

(defn get-tree
  "Get tree from person id"
  ([]
   (neo4j/with-transaction
     (let [find-root (person/find-root :include-node true :include-partners true :json-friendly true)
           root-node (:node find-root)
           root-node (assoc root-node :info (:entity find-root))
           root-node (assoc root-node :marriage (:partners find-root))]
       (get-tree-from-node root-node default-depth))))

  ([person-id]
   (neo4j/with-transaction
     (let [find-root (find-root person-id)
            root-node (:node find-root)
            root-node (assoc root-node :info (:entity find-root))
            root-node (assoc root-node :marriage (:partners find-root))]
        (get-tree-from-node root-node default-depth))
     )))
