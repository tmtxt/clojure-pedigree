(ns app.controllers.person.add.from-parent
  (:require [app.controllers.person.add.render :as render]
            [app.controllers.person.util :refer [find-person-from-request create-person-from-request]]
            [slingshot.slingshot :refer [try+ throw+]]
            [clojure.algo.monads :refer :all]
            [app.logic.pedigree-relation :as pedigree-relation]
            [app.logic.add-person :as add-person]
            [ring.util.response :refer [redirect]]))

(defn process-get-request [request]
  (domonad maybe-m
           [parent   (find-person-from-request request "parentId")
            role     (pedigree-relation/detect-parent-role-single parent)
            role-key (keyword role)]
           (render/add-page request {:action "add"
                                     :from "parent"
                                     :parent {role-key parent}})))

(defn- find-parents
  "Find parents entities from request, return [father mother]"
  [request]
  (let [father (find-person-from-request request "fatherId")
        mother (find-person-from-request request "motherId")
        parents [father mother]]
    (when (every? nil? parents) (throw+ "nil all"))
    [father mother]))

(defn- create-person
  "Create person from request"
  [request]
  (if-let [person (create-person-from-request request)]
    person
    (throw+ "cannot create person")))

(defn- create-relation
  "Create relation between child and parents"
  [person father mother]
  (let [rels (add-person/from-parent person father mother)
        {father-child :father-child
         mother-child :mother-child} rels]
    (when (every? nil? [father-child mother-child]) (throw+ "cannot create relation"))))

(defn process-post-request [request]
  (try+
   (let [[father mother] (find-parents request)
         person (-> (create-person request))]
     (create-relation person father mother)
     (redirect (str "/person/detail/" (person :id))))
   (catch Object _ (render/error-page request))))
