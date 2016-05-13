(ns app.services.minor-content
  (:require [app.services.util :refer [call call-json]]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn find [key]
  (call-json :svc-minor-content "/find" :get {:key key}))

(defn update [key value]
  (call-json :svc-minor-content
             "/update"
             :post
             {:key   key
              :value value}))

(defn add [key value]
  (try+
   (->> {:key key
         :value value}
        (call :svc-minor-content "/add" :post))
   true
   (catch Object _ false)))
