(ns app.services.minor-content
  (:require [app.services.util :refer [call]]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn find [key]
  (try+
   (-> (call :svc-minor-content "/find" :get {:key key})
       (get-in [:data :value]))
   (catch Object _ {:content ""})))
