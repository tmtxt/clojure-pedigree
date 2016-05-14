(ns app.services.person
  (:require [app.services.util :refer [call call-json]]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn find-by-id [person-id]
  (try+
   (-> (call :svc-person "/find/byId" :get {:person-id person-id})
       (:data))
   (catch Object _ nil)))

(defn find-root []
  (try+
   (-> (call :svc-person "/find/root" :get {})
       (:data))
   (catch Object _ nil)))

(defn add [person]
  (call-json :svc-person "/add" :post person))

(defn count []
  (call-json :svc-person "/count" :get {}))
