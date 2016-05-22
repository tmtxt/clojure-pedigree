(ns app.services.person
  (:refer-clojure :exclude [count update])
  (:require [app.services.util :refer [call call-json]]))

(defn find-by-id [person-id]
  (call-json :svc-person "/find/byId" :get {:person-id person-id}))

(defn find-root []
  (call-json :svc-person "/find/root" :get {}))

(defn add [person]
  (call-json :svc-person "/add" :post person))

(defn update [person]
  (call-json :svc-person "/update" :post person))

(defn count []
  (call-json :svc-person "/count" :get {}))

(defn find-by-name [name]
  (call-json :svc-person "/find/byName" {:name name}))

(defn find-by-genders [genders]
  (call-json :svc-person "/find/byGenders" {:genders genders}))
