(ns app.tree.main
  (:require [app.models.person :as person]
            [app.util.neo4j.command :as ncm]))

(def ^{:private true} default-depth 5)

(defn- get-tree-from-node [root & [depth]]
  (ncm/query-tree (:user_id root)))

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
