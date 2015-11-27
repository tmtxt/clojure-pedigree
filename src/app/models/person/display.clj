(ns app.models.person.display
  (:require [clj-time.format :as f]
            [clj-time.coerce :as c]
            [app.util.datetime :as dt]))

(def ^:private unknown-string "String to display when unknown" "Chưa có thông tin")

(def ^:private genders-display-map
  {"male" "Nam"
   "female" "Nữ"
   "gay" "Gay"
   "les" "Les"
   "unknown" unknown-string})

(def ^:private statuses-display-map
  {"alive" "Còn sống"
   "dead" "Đã mất"
   "unknown" unknown-string})

(defn gender-to-string [gender]
  (get genders-display-map gender (genders-display-map "unknown")))

(defn status-to-string [status]
  (get statuses-display-map status (statuses-display-map "unknown")))

(defn timestamp-to-string [timestamp]
  (if (nil? timestamp)
    unknown-string
    (->> timestamp (c/from-sql-time) (f/unparse dt/vn-time-formatter))))

(defn value-to-string [value]
  (if (nil? value)
    unknown-string
    value))
