(ns app.logic.person
  (:require [app.services.person :as svc-person]
            [app.services.image :as svc-image]
            [slingshot.slingshot :refer [throw+]]
            [clojure.algo.monads :refer :all]))

(defn find-by-id "Find person entity by id" [id]
  (svc-person/find-by-id id))

(defn- store-image [person]
  (domonad maybe-m
           [picture   (:picture person)
            file-name (svc-image/add picture "person")]
           file-name))

(defn add [person]
  (->> (store-image person)
       (assoc person :picture)
       (svc-person/add)))
