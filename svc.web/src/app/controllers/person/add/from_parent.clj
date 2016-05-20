(ns app.controllers.person.add.from-parent
  (:require [app.controllers.person.add.render :as render]
            [app.controllers.person.util :refer [find-person create-person]]
            [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [redirect]]
            [app.services.pedigree-relation :as svc-pr]))

(defn process-get-request [request]
  (try+
   (let [
         ;; find parent from request
         {parent :entity} (find-person request "parentId")
         _                (when-not parent (throw+ "parent empty"))

         ;; detect the role of this parent
         role (-> (svc-pr/detect-parent-role-single parent)
                  (keyword))
         ]
     (render/add-page request {:action "add"
                               :from "parent"
                               :parent {role parent}}))
   (catch Object _ (render/error-page request))))

(defn- add-parent [request key person-node func]
  (try+
   (let [
         ;; find parent from request
         {parent-node :node} (find-person request key)

         ;; create relation
         rel (func person-node parent-node)
         ]
     rel)
   (catch Object _ nil)))

(defn process-post-request [request]
  (try+
   (let [{person-node   :node
          person-entity :entity} (create-person request)
         father-rel (add-parent request "fatherId" person-node svc-pr/add-from-father)
         mother-rel (add-parent request "motherId" person-node svc-pr/add-from-mother)]
     (when (every? nil? [father-rel mother-rel]) (throw+ "nil all"))
     (redirect (str "/person/detail/" (person-node :id))))
   (catch Object res (render/error-page request))))
