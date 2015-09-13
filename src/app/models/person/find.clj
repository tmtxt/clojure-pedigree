(ns app.models.person.find
  (:require [korma.core :as kc]
            [app.util.db-util :as db-util]
            [app.neo4j.node :as node]
            [app.neo4j.main :as neo4j]
            [app.models.person.definition :refer [person]]
            [app.models.person.util :as model-util]
            [app.models.person.prepare :as prepare]
            [camel-snake-kebab.extras :refer [transform-keys]]
            [camel-snake-kebab.core :refer :all]))

(defn- process-full-name [full-name]
  (if full-name ['like (str "%" full-name "%")] nil))

(defn- process-gender [gender]
  (prepare/prepare-gender gender))

(defn- process-alive-status [alive-status]
  (prepare/prepare-alive-status alive-status))

(defn- process-birth-date [birth-date]
  (prepare/prepare-birth-date birth-date))

(defn- process-death-date [death-date]
  (prepare/prepare-death-date death-date))

(defn- process-criteria [criteria]
  (let [{full-name :full-name
         gender :gender
         alive-status :alive-status
         birth-date :birth-date
         death-date :death-date} criteria
         criteria (if full-name (->> full-name
                                     (process-full-name)
                                     (assoc criteria :full-name))
                      criteria)
         criteria (if gender (->> gender
                                  (process-gender)
                                  (assoc criteria :gender))
                      criteria)
         criteria (if alive-status (->> alive-status
                                        (process-alive-status)
                                        (assoc criteria :alive-status))
                      criteria)
         criteria (if birth-date (->> birth-date
                                      (process-birth-date)
                                      (assoc criteria :birth-date))
                      criteria)
         criteria (if death-date (->> death-date
                                      (process-death-date)
                                      (assoc criteria :death-date))
                      criteria)]
    (model-util/camel-keys->snake-keys criteria)))

(defn find-entity [criteria]
  (->> criteria
       (process-criteria)
       (kc/where)
       (kc/select person)
       (first)))

(defn find-node-from-entity [entity]
  (if entity
    (node/find-by-props :person {:person_id (:id entity)})
    nil))

;;; you should use this function
(defn find-person-by
  [criteria & {:keys [include-node include-marriage]
               :or {include-node false
                    include-marrage false}}]
  (let [result {}
        person-entity (find-entity criteria)
        person-node (if include-node (find-node-from-entity person-entity) nil)]
    (assoc result
           :entity person-entity
           :node person-node)
    ))
