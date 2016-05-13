(ns app.controllers.person.util
  (:require [app.util.main :as util]
            [app.models.person :as person]
            [clojure.java.io :as io]
            [clj-time.core :as time]
            [clj-time.format :as time-format]
            [digest :refer [sha-256]]
            [me.raynes.fs :refer [extension]]
            [clojure.string :refer [blank?]]
            [slingshot.slingshot :refer [try+ throw+]]
            [app.logic.person :as person-logic]))

(defn find-person-from-request [request param-name]

  (let [param-name (keyword param-name)]
    (-> (util/params request)
        (get param-name)
        (person-logic/find-by-id)
        (:entity))))

(defn params-to-person-data
  [{full-name :name
    birth-date :birthdate
    status :status
    gender :gender
    death-date :deathdate
    phone :phone
    picture :picture
    address :address
    summary :history}]
  {:full-name full-name
   :birth-date birth-date
   :death-date death-date
   :alive-status status
   :address address
   :picture picture
   :gender gender
   :phone-no phone
   :summary summary})

(defn generate-random-name []
  (let [now (time/now)
        time-formatter (time-format/formatters :basic-date-time)
        time-string (time-format/unparse time-formatter now)]
    (sha-256 time-string)))

(defn create-person-from-request [request]
  (let [params (util/params request)
        person-data (params-to-person-data params)
        person (person-logic/add person-data)]
    (:entity person)))

(defn update-person-picture
  [params person]
  (try+
   (let [{{temp-file :tempfile original-name :filename} :picture} params
         {picture :picture} person]
     (when (nil? original-name) (throw+ picture))
     (when (blank? original-name) (throw+ picture))
     ;; delete the old file
     (when (-> picture (.contains "person-image"))
       (io/delete-file (io/file (str "resources/public" picture))))
     ;; store the new file
     ;; (store-person-picture params)
     )
   (catch Object pic pic)))

(defn find-person "Find person from request" [request param-name]
  (let [param-name (keyword param-name)
        person     (-> (util/params request)
                       (get param-name)
                       (person-logic/find-by-id))]
    (when-not (:entity person) (throw+ "person not found"))
    person))

(defn create-person "Create person from request" [request]
  (let [params      (util/params request)
        person-data (params-to-person-data params)
        person      (person-logic/add person-data)]
    (when-not (:entity person) (throw+ "cannot create person"))
    person))
