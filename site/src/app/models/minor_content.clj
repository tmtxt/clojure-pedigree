(ns app.models.minor-content
  (:require [korma.core :refer [defentity table pk select where transform prepare update set-fields] :rename {update upd}]
            [clojure.data.json :as json]
            [app.util.pg :as pg]))

(defn- transform-data [data]
  (let [value (-> data :value .getValue
                  (json/read-str :key-fn keyword))]
    (assoc data :value value)))

(defn- prepare-data [data]
  (let [value (->> data :value
                   (json/write-str)
                   (pg/str->pgobject "jsonb"))]
    (assoc data :value value)))

(defentity minor-content
  (table :tbl_minor_content)
  (pk :id)
  (transform transform-data)
  (prepare prepare-data))

(defn find-content
  "Find content by its key"
  [key]
  (-> minor-content
      (select (where {:key key}))
      first
      :value))

(defn update-content
  "Update content by its key"
  [key val]
  (upd minor-content (set-fields {:value val})
       (where {:key key})))
