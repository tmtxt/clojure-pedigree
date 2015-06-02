(ns app.util.dbUtil
  (:import [org.postgresql.util PGobject])
  (:require [korma.core :as kc]))

(defn str->pgobject
  "Convert string into pgobject. Used for transform"
  [type value]
  (doto (PGobject.)
    (.setType type)
    (.setValue value)))

(defn table-empty?
  "Check if a table is empty, contains no row"
  [entity]
  (let [count-list (kc/select entity (kc/aggregate (count :*) :cnt))
        count (->> count-list (first) (:cnt))]
    (zero? count)))

(defn exists?
  "Check if the entity is exist"
  [entity where]
  (let [count-list (kc/select entity (kc/aggregate (count :*) :cnt) (kc/where where))
        count (->> count-list (first) (:cnt))]
    (not (zero? count)))
  )

(defn find-by-id
  "Find entity by id"
  [entity id]
  (->> (kc/where {:id id})
       (kc/select entity)
       (first)))
