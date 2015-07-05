(ns app.tree.main
  (:require [app.models.person :as person]))

(def default-depth 5)

(defn- get-tree-from-node [root]
  (println root))

(defn get-tree
  "Get tree from user id"
  ([]
   (let [root-node (person/find-root-node)]
     (get-tree-from-node root-node)))

  ([user-id]
   (let [root-node (person/find-node-by-user-id user-id)]
     (get-tree-from-node root-node))))
