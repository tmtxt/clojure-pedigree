(ns app.models.person
  (:require [app.models.person.definition :as definition]
            [app.models.person.add :as add]
            [app.models.person.find :as find]
            [app.models.person.delete :as delete]
            [app.models.person.update :as update]
            [app.models.person.parent :as parent]
            [app.models.person.json :as json]

            [app.models.person.search :as search]))

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
(def add-person nil)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Functions for deleting person

;;; Delete one person from the system by its id
;;; Required params
;;;  id: the (pg) id of the person
(def delete-person nil)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Functions for updating person

;;; Update person based on its id
;;; Required params
;;;  id: the (pg) id of the person
;;;  person-data: person data map
(def update-person nil)

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
(def find-person-by nil)

;;; Find root person
;;; Keyword params
;;; :include-node
;;; :include-partners
;;; :json-friendly
(def find-root nil)

;;; Find person by id
;;; Required params
;;; id: int
;;; Keyword params
;;; :include-node
;;; :include-partners
;;; :json-friendly
(def find-person-by-id nil)

;;;;;;;;;;;;;;;;;;;;
;;; Find entity only

;;; Required Params
;;; full-name: string
(def find-entity-by-full-name nil)

;;;;;;;;;;;;;;;;;;;;
;;; Find node only

;;; Find node by person is
;;; Required Params
;;; id: int
(def find-node-by-person-id nil)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Find multiple persons

;;; Find all entities by the list of id
;;; Required Params
;;; ids: [int]
(def find-entities-by-ids nil)

;;; Find all entities by full name
;;; Required Params
;;; full-name: string
(def find-entities-by-full-name nil)

;;; Find all entities by genders
;;; Required Params
;;; genders: [string]
(def find-entities-by-genders nil)

;;; Find all partners entity of one entity
;;; Required Params
;;; entity: PersonEntity
(def find-partners-of-entity nil)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Util functions

;;; Count parent of one entity
;;; Required Params
;;; entity: PersonEntity
(def count-parents nil)

;;; Whether this entity has enough parent?
;;; Required Params
;;; entity: PersonEntity
(def enough-parents? nil)

;;; Convert Person Entity to Json friendly Entity
(def json-friendlify nil)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; NEW
(def find-all-by-ids search/find-all-by-ids)
(def find-by-id search/find-by-id)
(def add add/add-person)
