(ns app.models.person.add
  (:require [app.models.person.definition :as definition]
            [korma.core :as kc]
            [app.neo4j.main :as neo4j]
            [app.models.person.validation :as validation]
            [slingshot.slingshot :refer [throw+ try+]]
            [app.neo4j.node :as node]))

(defn add-person
  "Add new person into postgres and neo4j."
  [person-data & {:keys [is-root]
              :or {is-root false}}]
  (let [errors (validation/validate-person-data person-data)]
    (when (-> errors empty? not)
      (throw+ {:type :pg-validation
               :success false
               :errors errors})))
  (let [person-entity (kc/insert definition/person
                                 (kc/values person-data))
        person-node (node/create-or-update
                     :person
                     {:person_id (:id person-entity)}
                     {:is_root is-root})]
    {:success true
     :entity person-entity
     :node person-node}))
