(ns app.models.person.validation
  (:require [validateur.validation :as vl]
            [clj-time.format :as f]
            [clj-time.coerce :as c]
            [app.util.datetime :as datetime-util]))

(defn- validate-date-time [date-time-string]
  (if (nil? date-time-string)
    true
    (try
      (do
        (f/parse datetime-util/vn-time-formatter date-time-string)
        true)
      (catch Exception e false))
    ))

(def validate-person-data
  (vl/validation-set
   (vl/validate-by :birth-date validate-date-time
                   :message "wrong format")
   (vl/validate-by :death-date validate-date-time
                   :message "wrong format")))
