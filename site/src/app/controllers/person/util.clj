(ns app.controllers.person.util
  (:require [app.util.main :as util]
            [app.models.person :as person]
            [clojure.java.io :as io]
            [config.main :refer [config]]
            [clj-time.core :as time]
            [clj-time.format :as time-format]
            [digest :refer [sha-256]]
            [me.raynes.fs :refer [extension]]
            [clojure.string :refer [blank?]]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn find-person-from-request
  "Find person entity from request based on the param name"
  [request param-name]
  (let [person-id (->> param-name name (util/param request) util/parse-int)
        entity (-> person-id person/find-by-id :entity)]
    (if (empty? entity) nil entity)))

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

(defn store-person-picture [{{temp-file :tempfile original-name :filename} :picture}]
  (try+
   (when (nil? original-name) (throw+ nil))
   (when (blank? original-name) (throw+ nil))
   (let [file-name (generate-random-name)
         ext (extension original-name)
         file-name (str file-name ext)]
     (io/copy temp-file (io/file "resources"
                                 "public"
                                 "person-image"
                                 "original"
                                 file-name))
     (throw+ (str "/person-image/original/" file-name)))

   (catch nil? _ nil)
   (catch #(instance? String %) res res)))

(defn create-person-from-request [request]
  (let [params (util/params request)
        file-name (store-person-picture params)
        params (assoc params :picture file-name)
        person-data (params-to-person-data params)]
    (person/add person-data)))

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
     (store-person-picture params))
   (catch Object pic pic)))
