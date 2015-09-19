(ns app.models.person
  (:import [org.postgresql.util PGobject])
  (:require [korma.core :refer :all]
            [app.util.dbUtil :as db-util]
            [app.neo4j.main :as neo4j]
            [app.neo4j.node :as node]
            [app.neo4j.query :as query]
            [app.neo4j.relation :as relation]
            [validateur.validation :as vl]
            [config.main :refer [config]]
            [slingshot.slingshot :refer [throw+ try+]]
            [app.models.pedigreeRelation :as prl]
            [app.models.marriageRelation :as mrl]
            [app.models.person.definition :as definition]
            [app.models.person.add :as add]
            [app.models.person.find :as find]
            [app.models.person.parent :as parent]))

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

(def person definition/person)

(def add-person add/add-person)

(def find-person-by find/find-person-by)
(def find-root find/find-root)
(def find-entities-by-ids find/find-entities-by-ids)
(def find-person-by-id find/find-person-by-id)
(def find-node-by-person-id find/find-node-by-person-id)
(def find-entity-by-full-name find/find-entity-by-full-name)
(def find-entities-by-full-name find/find-entities-by-full-name)
(def find-entities-by-genders find/find-entities-by-genders)
(def find-partners-of-entity find/find-partners-of-entity)
(def count-parents parent/count-parents)
(def enough-parents? parent/enough-parents?)

(defn find-by-genders [genders]
  (let [gender-pg
        (map
         (fn [gender]
           (doto (PGobject.)
             (.setType "person_gender_enum")
             (.setValue gender)))
         genders)]
    (->> (where {:gender [in gender-pg]})
         (select person))))
