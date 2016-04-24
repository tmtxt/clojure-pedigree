(ns app.controllers.person.add.from-parent
  (:require [app.models.person :as person]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.controllers.person.util :refer [find-person-from-request create-person-from-request]]
            [app.models.pedigree-relation :as prl]
            [korma.db :refer [transaction rollback]]
            [app.util.main :as util]
            [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [redirect]]
            [app.views.main :as view]
            [clojure.algo.monads :refer :all]
            [app.logic.pedigree-relation :as pedigree-relation]
            [app.logic.add-person :as add-person]))

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

(defn process-post-request [request]
  (try+
   (let [[father mother] (find-parents request)
         person (-> (create-person request))]
     (add-person/from-parent person father mother)
     (redirect (str "/person/detail/" (person :id))))
   (catch Object err (println err) ;; (render/error-page request)
          )))
