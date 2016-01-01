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

(defn- json-friendlify-each [k v & [keep-nil]]
  (cond
    (-> timestamp-keys (contains? k))
    [k (display/timestamp-to-string v keep-nil)]
    (= k :gender)
    [k (display/gender-to-string v keep-nil)]
    (= k :alive-status)
    [k (display/status-to-string v keep-nil)]
    :else [k (display/value-to-string v keep-nil)]))

(defn json-friendlify [person-entity & {:keys [fields keep-nil]
                                        :or {fields nil
                                             keep-nil false}}]
  (let [fields (when fields (set fields))]
    (into {}
          (for [[k v] person-entity]
            (cond
              (nil? fields) (json-friendlify-each k v keep-nil)
              (-> fields (contains? k)) (json-friendlify-each k v keep-nil)
              :else [k v]
              )))))

(defn json-friendlify-all [person-entities]
  (map #(json-friendlify %) person-entities))
