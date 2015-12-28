(ns app.models.person.prepare
  (:require [app.util.pg :as db-util]
            [app.models.person.util :as model-util]
            [slingshot.slingshot :refer [try+ throw+]]
            [clojure.string :refer [blank?]]))

(defn prepare-alive-status [alive-status]
  (db-util/str->pgobject "person_alive_status_enum" alive-status))

(defn prepare-gender [gender]
  (db-util/str->pgobject "person_gender_enum" gender))

(defn prepare-birth-date [birth-date]
  (try+
   (when (nil? birth-date) (throw+ nil))
   (when (blank? birth-date) (throw+ nil))
   (db-util/str->pgtimestamp birth-date)
   (catch nil? _ nil)))

(defn prepare-death-date [death-date]
  (try+
   (when (nil? death-date) (throw+ nil))
   (when (blank? death-date) (throw+ nil))
   (db-util/str->pgtimestamp death-date)
   (catch nil? _ nil)))

(defn prepare-data
  [{alive-status :alive-status
    gender :gender
    birth-date :birth-date
    death-date :death-date
    :as data}]
  (let [alive-status (prepare-alive-status alive-status)
        gender (prepare-gender gender)
        birth-date (prepare-birth-date birth-date)
        death-date (prepare-death-date death-date)
        data (assoc data
                    :alive-status alive-status
                    :birth-date birth-date
                    :death-date death-date
                    :gender gender)]
    (model-util/camel-keys->snake-keys data)))
