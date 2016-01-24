(ns app.util.datetime
  (:require [clj-time.format :as f]
            [clj-time.coerce :as c]))

(def default-formatter (f/formatter "dd/MM/yyyy"))

(defn timestamp->string [timestamp]
  (->> timestamp
       (c/from-sql-time)
       (f/unparse default-formatter)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; TODO remove this
(def vn-time-formatter (f/formatter "dd/MM/yyyy"))
(def default-time-formatter vn-time-formatter)
