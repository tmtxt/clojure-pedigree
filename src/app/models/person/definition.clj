(ns app.models.person.definition
  (:require [app.util.db-util :as db-util]
            [korma.core :as kc]
            [camel-snake-kebab.core :refer :all]
            [app.models.person.util :as model-util]
            [app.models.person.prepare :as prepare]
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
    [person-id is-root user-id])

;;; props list
(def EntityProps (PersonEntity/getBasis))

(def NodeProps (PersonNode/getBasis))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; transform data from clojure data to pg data when insert/update
(defn- prepare-data
  [{alive-status :alive-status
    gender :gender
    birth-date :birth-date
    death-date :death-date
    :as data}]
  (let [alive-status (prepare/prepare-alive-status alive-status)
        gender (prepare/prepare-gender gender)
        birth-date (prepare/prepare-birth-date birth-date)
        death-date (prepare/prepare-death-date death-date)
        data (assoc data
           :alive-status alive-status
           :birth-date birth-date
           :death-date death-date
           :gender gender)]
    (model-util/camel-keys->snake-keys data)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(defn entity-to-record
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

(defn node-to-record
  "Convert node to PersonNode record"
  [node]
  (let [node (transform-keys ->kebab-case node)]
    (map->PersonNode node)))
