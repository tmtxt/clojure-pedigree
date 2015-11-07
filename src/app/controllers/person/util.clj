(ns app.controllers.person.util
  (:require [app.util.main :as util]
            [app.models.person :as person]))

(defn find-person-from-request [request param-name]
  (let [param-name (keyword param-name)
        params (util/params request)
        param (get params param-name)]
    (-> param util/parse-int person/find-person-by-id :entity)))

(defn params-to-person-data
  [{full-name :name
    birth-date :birthdate
    status :status
    gender :gender
    death-date :deathdate
    phone :phone
    address :address}]

  {:full_name full-name
   ;; :birth_date birth-date
   ;; :death_date death-date
   :alive_status status
   :address address
   :gender gender
   :phone_no phone})

(defn create-person-from-request [request]
  (let [params (util/params request)
        person-data (params-to-person-data params)]
    (person/add-person person-data)))
