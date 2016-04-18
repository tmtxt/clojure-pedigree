(ns app.services.person
  (:require [app.services.util :refer [call]]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn find-by-id [person-id]
  (try+
   (-> (call :svc-person "/find/byId" :get {:person-id person-id})
       (:data))
   (catch Object _ nil)))
