(ns app.logic.person
  (:require [app.services.person :as svc-person]
            [slingshot.slingshot :refer [throw+]]))

(defn find-by-id "Find person entity by id" [id]
  (svc-person/find-by-id id))

(defn add [person]
  (svc-person/add person))
