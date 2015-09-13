(ns app.models.person.validation
  (:require [validateur.validation :as vl]
            [clj-time.format :as f]
            [clj-time.coerce :as c]))

(def vn-time-formatter (f/formatter "dd/MM/yyyy"))

(defn- validate-date-time [date-time-string]
  (if (nil? date-time-string)
    true
    (try
      (do
        (f/parse vn-time-formatter date-time-string)
        true)
      (catch Exception e false))
    ))

(def pg-validation
  (vl/validation-set
   (vl/validate-by :birth-date validate-date-time
                   :message "wrong format")
   (vl/validate-by :death-date validate-date-time
                   :message "wrong format")))
