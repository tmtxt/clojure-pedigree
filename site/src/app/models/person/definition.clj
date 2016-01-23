(ns app.models.person.definition
  (:require [korma.core :refer [defentity table pk transform prepare]]
            [app.models.person.prepare :refer [prepare-data]]
            [app.models.person.transform :refer [transform-data]]
            [app.util.model :refer [entity->record record->entity]]))

(defrecord PersonEntity
    [id full-name address phone-no summary gender alive-status
     death-date birth-date picture created-at job])

(defrecord PersonNode
    [person-id is-root])

(defn- transform-func
  [data]
  (-> data (entity->record map->PersonEntity) transform-data))

(defn- prepare-func
  [data]
  (-> data prepare-data record->entity))

(defentity person
  (table :tbl_person)
  (pk :id)
  (transform transform-func)
  (prepare prepare-func))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; TODO remove these
(defn entity-to-record
  "Convert korma entity to PersonEntity record"
  [entity]
  entity)

(defn node-to-record
  "Convert node to PersonNode record"
  [node]
  node)

(defn record-to-node
  "Convert PersonNode record back to node"
  [record]
  record)

;;; props list
(def EntityProps (PersonEntity/getBasis))

(def NodeProps (PersonNode/getBasis))
