(ns app.models.person.delete
  (:require [app.models.person.definition :as definition]
            [korma.core :as kc]
            [app.neo4j.main :as neo4j]
            [app.neo4j.query :as query]
            [slingshot.slingshot :refer [throw+ try+]]))

(defn delete-person [id]
  (neo4j/execute-statement query/delete-person id)
  (kc/delete definition/person
             (kc/where {:id id})))
