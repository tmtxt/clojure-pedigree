(ns app.models.minor-content
  (:require [korma.core :refer [defentity table pk select where transform]]
            [clojure.data.json :as json]))

(defn- transform-data [data]
  (let [value (-> data :value .getValue
                  (json/read-str :key-fn keyword))]
    (assoc data :value value)))

(defentity minor-content
  (table :tbl_minor_content)
  (pk :id)
  (transform transform-data))

(defn find-content
  "Find content by its key"
  [key]
  (-> minor-content
      (select (where {:key key}))
      first
      :value))
