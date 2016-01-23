(ns app.models.person.node
  (:require [app.neo4j.main :as neo4j]
            [app.util.model :refer [entity->record record->entity]]))

(defrecord PersonNode
    [person-id is-root])

(defn- neonode [method endpoint data]
  (let [result (neo4j/neonode method (str "/person/" endpoint) data)]
    (if (:success result)
      (:data result)
      nil)))

(defn find-by-person-id [person-id]
  (let [result (neonode :get "findPerson" {:personId person-id})
        node (entity->record result map->PersonNode)]
    node))

(defn find-root []
  (let [result (neonode :get "findRoot" {})
        node (entity->record result map->PersonNode)]
    node))

(defn find-partners [person-id]
  (neonode :get "findPartners" {:personId person-id}))

(defn find-parents [person-id]
  (neonode :get "findParents" {:personId person-id}))

(defn add-or-update [data]
  (let [data (record->entity data)
        result (neonode :post "addOrUpdate" {:data data})
        node (entity->record result map->PersonNode)]
    node))

(defn delete [person-id]
  (neonode :post "delete" {:personId person-id}))

(defn count-parents [person-id]
  (neonode :get "countParents" {:personId person-id}))
