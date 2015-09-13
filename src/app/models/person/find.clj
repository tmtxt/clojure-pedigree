(ns app.models.person.find
  (:require [korma.core :as kc]
            [app.util.db-util :as db-util]
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

(defn pg-find-person-by
  [criteria]
  (->> criteria
       (process-criteria)
       (kc/where)
       (kc/select person)
       (first)))
