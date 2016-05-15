(ns app.services.person
  (:require [app.services.util :refer [call call-json]]))

(defn find-by-id [person-id]
  (call-json :svc-person "/find/byId" :get {:person-id person-id}))

(defn find-root []
  (call-json :svc-person "/find/root" :get {}))

(defn add [person]
  (call-json :svc-person "/add" :post person))

(defn count []
  (call-json :svc-person "/count" :get {}))
