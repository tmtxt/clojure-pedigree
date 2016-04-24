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
            [app.logic.pedigree-relation :as pedigree-relation]))

(defn process-get-request [request]
  (domonad maybe-m
           [parent   (find-person-from-request request "parentId")
            role     (pedigree-relation/detect-parent-role-single parent)
            role-key (keyword role)]
           (render/render-add-page request {:action "add"
                                            :from "parent"
                                            :parent {role-key parent}})))

(defn- find-parents
  "Find parents entities from request, return [father mother]"
  [request]
  (let [find-fn #(find-person-from-request request %)
        father (find-fn :fatherId)
        mother (find-fn :motherId)]
    [father mother]))

(defn- validate-parents
  "Validate parent entities"
  [parents]
  (when (every? nil? parents) (throw+ "nil all")))

(defn process-post-request [request]
  (transaction
   (try+
    (let [[father mother] (find-parents request)
          _ (validate-parents [father mother])
          person (-> request create-person-from-request :entity)]
      (cond
        (nil? father) (prl/add-child-for-mother mother person 0)
        (nil? mother) (prl/add-child-for-father father person 0)
        :else (prl/add-child father mother person 0))
      (redirect (str "/person/detail/" (:id person))))
    (catch Object _ (render/render-error request)))))
