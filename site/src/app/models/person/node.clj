(ns app.models.person.node
  (:require [app.neo4j.main :as neo4j]
            [slingshot.slingshot :refer [throw+ try+]]))

(defn find-node-by-person-id [person-id]
  (let [result (->> {:personId person-id}
                    (neo4j/neonode :get "/person/findPerson"))]
    (if (:success result)
      (:data result)
      nil)))
