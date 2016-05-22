(ns app.logic.person
  (:require [app.services.person :as svc-person]
            [app.services.image :as svc-image]
            [slingshot.slingshot :refer [try+ throw+]]
            [clojure.algo.monads :refer :all]))

(defn find-by-id "Find person entity by id" [id]
  (svc-person/find-by-id id))

(defn- store-image [person]
  (domonad maybe-m
           [picture   (:picture person)
            size      (:size picture)
            not-0     (if (= size 0) nil true)
            file-name (svc-image/add picture "person")]
           file-name))

(defn add [person]
  (->> (store-image person)
       (assoc person :picture)
       (svc-person/add)))

(defn- process-image [old-person new-person]
  (try+
   (let [{picture  :picture
          replace? :replace-picture} new-person

         _ (when (not replace?) (throw+ (dissoc new-person :picture)))

         _ (svc-image/delete (:picture old-person) "person")

         picture (store-image new-person)
         person  (assoc new-person :picture picture)]
     person)
   (catch Object person person)))

(defn update-person "Update person by person-id using the person-data" [old-person new-person]
  (let [person (process-image old-person new-person)]
    (svc-person/update person)))
