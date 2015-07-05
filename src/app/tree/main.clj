(ns app.tree.main
  (:require [app.models.person :as person]
            [app.util.neo4j.command :as ncm]))

(def ^{:private true} default-depth 5)

(defn- recur1 [tree rows]
  (let [row (first rows)]
    (if row
      (let [[path rel in-parent out-parent child] row
            short-path (vec (drop-last path))
            new-tree (assoc-in tree short-path {})]
        (recur new-tree (rest rows)))
      tree)))

(defn- get-tree-from-node [root & [depth]]
  (let [rows (ncm/query-tree (:user_id root) depth)
        init-tree {(:user_id root) {}}]
    (recur1 init-tree rows)
    ))

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
