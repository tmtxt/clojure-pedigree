(ns app.services.minor-content
  (:require [app.services.util :refer [call]]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn find [key]
  (try+
   (-> (call :svc-minor-content "/find" :get {:key key})
       (get-in [:data :value]))
   (catch Object _ {:content ""})))

(defn update [key value]
  (try+
   (->> {:key key
         :value value}
        (call :svc-minor-content "/update" :post))
   true
   (catch Object _ false)))
