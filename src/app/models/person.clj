(ns app.models.person
  (:require [app.models.person.definition :as definition]
            [app.models.person.add :as add]
            [app.models.person.find :as find]
            [app.models.person.parent :as parent]
            [app.models.person.json :as json]))

(def GENDERS_MAP
  {:male "male"
   :female "female"
   :gay "gay"
   :les "les"
   :unknown "unknown"})

(def STATUSES_MAP
  {:alive "alive"
   :dead "dead"
   :unknown "unknown"})

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Person Korma entity definition
(def person definition/person)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Functions for adding person

;;; Add one person to the system
;;; Required params
;;; person-data: PersonEntity or {}
;;; Keyword params
;;; :is-root - whether this person is root or not, default is false
;;; Return type
;;; {:success success-or-not
;;;  :entity  PersonEntity
;;;  :node    PersonNode}
(def add-person add/add-person)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Functions for finding person(s)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Find one person

;;;;;;;;;;;;;;;;;;;;
;;; Find one person with multiple information, default is to return the entity
;;; information only
;;; The first param of each function is the criteria (depending on each
;;; function, the criteria will be vary of types)
;;; The rest of the params are keyword params for additional data returned by
;;; the query
;;; :include-node     - include the neo4j node
;;; :include-partners - include the partners entities
;;; The return value is a map
;;; {:entity   the-entity-data
;;;  :node     the-neo4j-node
;;;  :partners the-partners-entities-as-vector}

;;; General find person function
;;; Required Params
;;; criteria: {}
;;; Keyword params
;;; :include-node
;;; :include-partners
;;; :json-friendly
(def find-person-by find/find-person-by)

;;; Find root person
;;; Keyword params
;;; :include-node
;;; :include-partners
;;; :json-friendly
(def find-root find/find-root)

;;; Find person by id
;;; Required params
;;; id: int
;;; Keyword params
;;; :include-node
;;; :include-partners
;;; :json-friendly
(def find-person-by-id find/find-person-by-id)

;;;;;;;;;;;;;;;;;;;;
;;; Find entity only

;;; Required Params
;;; full-name: string
(def find-entity-by-full-name find/find-entity-by-full-name)

;;;;;;;;;;;;;;;;;;;;
;;; Find node only

;;; Find node by person is
;;; Required Params
;;; id: int
(def find-node-by-person-id find/find-node-by-person-id)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Find multiple persons

;;; Find all entities by the list of id
;;; Required Params
;;; ids: [int]
(def find-entities-by-ids find/find-entities-by-ids)

;;; Find all entities by full name
;;; Required Params
;;; full-name: string
(def find-entities-by-full-name find/find-entities-by-full-name)

;;; Find all entities by genders
;;; Required Params
;;; genders: [string]
(def find-entities-by-genders find/find-entities-by-genders)

;;; Find all partners entity of one entity
;;; Required Params
;;; entity: PersonEntity
(def find-partners-of-entity find/find-partners-of-entity)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Util functions

;;; Count parent of one entity
;;; Required Params
;;; entity: PersonEntity
(def count-parents parent/count-parents)

;;; Whether this entity has enough parent?
;;; Required Params
;;; entity: PersonEntity
(def enough-parents? parent/enough-parents?)

;;; Convert Person Entity to Json friendly Entity
(def json-friendlify json/json-friendlify)
