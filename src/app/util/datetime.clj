(ns app.util.datetime
  (:require [clj-time.format :as f]
            [clj-time.coerce :as c]))

(def vn-time-formatter (f/formatter "dd/MM/yyyy"))
