(ns app.models.person.definition
  (:require [app.util.db-util :as db-util]
            [korma.core :as kc]
            [camel-snake-kebab.core :refer :all]
            [camel-snake-kebab.extras :refer [transform-keys]]
            [config.main :refer [config]]))

;;; custom-defined record
;;; for postgres result
(defrecord PersonEntity
    [id full-name address
     phone-no summary gender
     alive-status death-date birth-date
     picture created-at job])

;;; for neo4j result
(defrecord PersonNode
    [person-id is-root])

;;; props list
(def EntityProps (PersonEntity/getBasis))

(def NodeProps (PersonNode/getBasis))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(defn- record-to-entity [record]
  (transform-keys ->snake_case record))

;;; transform data from clojure data to pg data when insert/update
(defn- prepare-data
  [{alive-status :alive-status
    gender :gender
    birth-date :birth-date
    :as data}]
  (let [to-enum #(if %1 (db-util/str->pgobject %2 %1) nil)
        to-timestamp #(if % (db-util/str->pgtimestamp %) nil)

        alive-status (to-enum alive-status "person_alive_status_enum")
        gender (to-enum gender "person_gender_enum")
        birth-date (to-timestamp birth-date)
        data (assoc data
           :alive-status alive-status
           :birth-date birth-date
           :gender gender)]
    (record-to-entity data)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(defn- entity-to-record
  "Convert korma entity to PersonEntity record"
  [entity]
  (let [entity (transform-keys ->kebab-case entity)]
    (map->PersonEntity entity)))

;;; transform data from pg object to clojure data when select
(defn- transform-data [data]
  (let [data (entity-to-record data)    ;convert to record first
        {picture :picture} data         ;destruct the data
        picture (if picture picture (:default-person-image config)) ;process the data
        ]
    ;; assoc back the data
    (assoc data
           :picture picture)
    ))

;;; korma entity
(kc/defentity person
  (kc/table :tbl_person)
  (kc/pk :id)
  (kc/transform transform-data)
  (kc/prepare prepare-data))
