(ns app.util.db-util
  (:import [org.postgresql.util PGobject])
  (:require [korma.core :as kc]
            [clj-time.format :as f]
            [clj-time.coerce :as c]))

(defn str->pgobject
  "Convert string into pgobject. Used for transform"
  [type value]
  (doto (PGobject.)
    (.setType type)
    (.setValue value)))

(def vn-time-formatter (f/formatter "dd/MM/yyyy"))

(defn str->pgtimestamp
  "Convert string into pbtimestamp"
  [time-string]
  (->> time-string
       (f/parse vn-time-formatter)
       c/to-long
       java.sql.Timestamp.))

(defn table-empty?
  "Check if a table is empty, contains no row"
  [entity]
  (let [count-list (kc/select entity (kc/aggregate (count :*) :cnt))
        count (->> count-list (first) (:cnt))]
    (zero? count)))

(defn exists?
  "Check if the entity is exist by where map"
  [entity where]
  (->> (kc/select
        entity
        (kc/aggregate (count :*) :cnt)
        (kc/where where))
       (first)
       (:cnt)
       (zero?)
       (not)))

(defn find-by-id
  "Find entity by id"
  [entity id]
  (->> (kc/where {:id id})
       (kc/select entity)
       (first)))

(defn find-all-by-ids
  "Find entity by a list of ids"
  [entity ids]
  (->> (kc/where {:id [in ids]})
       (kc/select entity)))

(defn find-all-by-attrs
  "Find all entities by attrs map"
  [entity where]
  (->> (kc/select
        entity
        (kc/where where))))

(defn find-by-attrs
  "Find the first matched entity by attrs map"
  [entity where]
  (-> (find-all-by-attrs entity where)
      (first)))

(defn find-all [entity]
  (kc/select entity))
