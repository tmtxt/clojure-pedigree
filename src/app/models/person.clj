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
(def find-entities-by-genders find/find-entities-by-genders)
(def find-partners-of-entity find/find-partners-of-entity)
(def count-parents parent/count-parents)
(def enough-parents? parent/enough-parents?)


(defn find-node-by-user-id
  "Find the node from neo4j using the input user id"
  [user-id]
  (node/find-by-props :person {:user_id user-id}))

(defn find-all-by-ids
  "Find all from postgres where id in ids list"
  [ids]
  (db-util/find-all-by-ids person ids))

(defn find-by-person-id
  "Find the info of the person from postgres with the person id"
  [id]
  (db-util/find-by-id person id))

(defn find-root-node
  "Find the root node from neo4j"
  []
  (let [[result] (neo4j/execute-statement query/find-root)
        data (-> result :data)
        rows (map #(:row %) data)
        row (first rows)
        [root marriage] row
        info (db-util/find-by-id person (:user_id root))
        root-person (assoc root :marriage (find-all-by-ids marriage))
        root-person (assoc root-person :info info)]
    root-person))

(defn- extract-partner-ids [rows]
  (map (fn [[id]] id) rows))

(defn- extract-partner-id-order [rows]
  (reduce (fn [id-order [id order]] (assoc id-order id order)) {} rows))

(defn- combine-partner-info [id-order partners]
  (map (fn [partner] (assoc partner :order (get id-order (:id partner)))) partners)
  )

(defn find-partners
  "Find all partners information of the input person"
  [person-id]
  (let [[result] (neo4j/execute-statement query/find-partner person-id)
        data (-> result :data)
        partners-list (map #(:row %) data)
        ids (extract-partner-ids partners-list)
        partners-id-order (extract-partner-id-order partners-list)
        partners-rows (find-all-by-ids ids)
        partners-info (combine-partner-info partners-id-order partners-rows)]
    partners-info))

(defn find-by-name [name]
  (select
   person
   (where {:full_name [like (str "%" name "%")]})))

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
