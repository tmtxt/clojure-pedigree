(ns app.models.person.json
  (:require [app.models.person.definition :as definition]
            [korma.core :as kc]
            [app.neo4j.main :as neo4j]
            [slingshot.slingshot :refer [throw+ try+]]
            [clj-time.format :as f]
            [clj-time.coerce :as c]
            [app.models.person.display :as display]
            [app.util.datetime :as dt]))

(def ^:private timestamp-keys #{:birth-date :death-date :created-at})

(defn json-friendlify [person-entity]
  (into {}
        (for [[k v] person-entity]
          (cond
            (-> timestamp-keys (contains? k))
            [k (display/timestamp-to-string v)]
            (= k :gender)
            [k (display/gender-to-string v)]
            (= k :alive-status)
            [k (display/status-to-string v)]
            :else [k (display/value-to-string v)]))))

(defn json-friendlify-all [person-entities]
  (map #(json-friendlify %) person-entities))
