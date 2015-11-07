(ns app.controllers.person.util
  (:require [app.util.main :as util]
            [app.models.person :as person]
            [clojure.java.io :as io]
            [config.main :refer [config]]
            [clj-time.core :as time]
            [clj-time.format :as time-format]
            [digest :refer [sha-256]]))

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

(defn generate-random-name []
  (let [now (time/now)
        time-formatter (time-format/formatters :basic-date-time)
        time-string (time-format/unparse time-formatter now)]
    (sha-256 time-string)))

(defn store-person-picture [params]
  (let [{{temp-file :tempfile} :picture} params
        file-name (generate-random-name)
        file-name (str file-name ".jpg")]
    (io/copy temp-file (io/file "resources" "public" file-name))))

(defn create-person-from-request [request]
  (let [params (util/params request)
        _ (store-person-picture params)
        person-data (params-to-person-data params)]
    (person/add-person person-data)))
