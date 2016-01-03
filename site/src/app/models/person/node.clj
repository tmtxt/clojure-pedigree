(ns app.models.person.node
  (:require [app.neo4j.main :as neo4j]
            [slingshot.slingshot :refer [throw+ try+]]))

(defn- neonode [method endpoint data]
  (let [result (neo4j/neonode method (str "/person/" endpoint) data)]
    (if (:success result)
      (:data result)
      nil)))

(defn find-by-person-id [person-id]
  (neonode :get "findPerson" {:personId person-id}))

(defn find-root []
  (neonode :get "findRoot" {}))

(defn find-partners [person-id]
  (neonode :get "findPartners" {:personId person-id}))

(defn find-parents [person-id]
  (neonode :get "findParents" {:personId person-id}))

(defn add-or-update [data]
  (neonode :post "addOrUpdate" {:data data}))

(defn delete [person-id]
  (neonode :post "delete" {:personId person-id}))
