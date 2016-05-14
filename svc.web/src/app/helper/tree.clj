(ns app.helper.tree
  (:require [app.services.tree :as svc-tree]
            [app.services.person :as svc-person]
            [app.services.marriage-relation :as svc-mr]))

(defn- get-partners "Get partner of person node" [node]
  (let [partner-nodes (svc-mr/find-partner-node (:id node))
        partners-info (map #(svc-person/find-by-id (:person-id %1)) partner-nodes)]
    partners-info))

(defn- get-root "Get person data of the tree" [person-id]
  (let [root (if (nil? person-id)
               (svc-person/find-root)
               (svc-person/find-by-id person-id))
        {node :node info :model} root
        partners-info (get-partners node)]
    {:node node
     :info info
     :marriage partners-info}))

(defn- query-tree "Query tree data from neo4j" [root-node-id depth]
  (let [results (svc-tree/get-tree root-node-id depth)]
    results))

(defn get-tree [person-id depth]
  (let [root-tree (get-root)]

    ))
