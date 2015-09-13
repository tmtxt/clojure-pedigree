(ns app.models.person.find
  (:require [app.models.person.definition :as definition]
            [korma.core :as kc]))

(defn add-person
  "Add new person into postgres and neo4j"
  [person-map & {:keys [is-root]
                 :or {is-root false}}]
  (kc/insert definition/person (kc/values person-map)))
