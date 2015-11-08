(ns app.models.person.validation
  (:require [validateur.validation :as vl]
            [clj-time.format :as f]
            [clj-time.coerce :as c]
            [app.util.datetime :as datetime-util]
            [slingshot.slingshot :refer [try+ throw+]]
            [clojure.string :refer [blank?]]))

(defn- validate-date-time [date-time-string]
  (try+
   (when (nil? date-time-string) (throw+ true))
   (when (blank? date-time-string) (throw+ true))
   (f/parse datetime-util/vn-time-formatter date-time-string)
   true
   (catch true? _ true)
   (catch false? _ false)
   (catch Object _ false)))

(def validate-person-data
  (vl/validation-set
   (vl/validate-by :birth-date validate-date-time
                   :message "wrong format")
   (vl/validate-by :death-date validate-date-time
                   :message "wrong format")))
