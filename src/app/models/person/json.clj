(ns app.models.person.json
  (:require [app.models.person.definition :as definition]
            [korma.core :as kc]
            [app.neo4j.main :as neo4j]
            [slingshot.slingshot :refer [throw+ try+]]
            [clj-time.format :as f]
            [clj-time.coerce :as c]
            [app.util.datetime :as dt]))

(def timestamp-keys #{:birth-date :death-date :created-at})

(defn json-friendlyize [person-entity]
  (into {}
        (for [[k v] person-entity]
          (if (-> timestamp-keys (contains? k))
            (if (nil? v) [k nil]
                [k (->> v (c/from-sql-time) (f/unparse dt/vn-time-formatter))])
            [k v]))))
