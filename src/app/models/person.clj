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
            [app.models.marriageRelation :as mrl]))

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

(defentity person
  (table :tbl_person)
  (pk :id)
  (prepare prepare-data)
  (transform (fn [{picture :picture :as p}]
               (if picture
                 p
                 (assoc p :picture (:default-person-image config))))))

(def pg-validation
  (vl/validation-set))

(def neo4j-validation
  (vl/validation-set
   (vl/presence-of :user_id)
   (vl/validate-by :user_id #(db-util/exists? person {:id %}) :message "User Id not exist")))

(defn add-person-node
  "Add person node into neo4j using the person entity, optionally specify keyword is-root of the system"
  [person-entity & {:keys [is-root]
                    :or {is-root false}}]
  (let [person-node (node/create-or-update
                     :person
                     {:user_id (person-entity :id)}
                     {:is_root is-root})]
    {:success true
     :person person-entity
     :node person-node}))

(defn add-person
  "Add new person into postgres and neo4j"
  [person-map & {:keys [is-root]
                 :or {is-root false}}]
  (let [errors (pg-validation person-map)]
    (if (empty? errors)
      (let [new-person (insert person (values person-map))]
        (add-person-node new-person :is-root is-root))
      {:success false
       :errors errors})))

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
