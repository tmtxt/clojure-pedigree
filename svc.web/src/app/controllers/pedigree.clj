(ns app.controllers.pedigree
  (:require [compojure.core :refer :all]
            [app.util.main :as util]
            [app.services.pedigree-relation :as svc-pr]
            [app.services.person :as svc-person]
            [app.logger.log-trace :as log-trace]))

(defn- find-person-node [request]
  (-> request
      util/params
      :personId
      util/parse-int
      svc-person/find-node-by-id))

(defn- parent-type "Detect parent type" [type]
  (get {"mother_child" :mother} type :father))

(defn- find-parent-entities "Find the parents entities of this person node" [node-id]
  (let [relations (svc-pr/find-parents node-id)]
    (reduce
     #(let [{type :parent-type id :parent-id} %2
            key (parent-type type)]
        (assoc %1 key (-> id svc-person/find-by-id :entity)))
     {} relations)))

(defn- get-parents [request]
  (let [
        ;; find person node
        {node-id :id} (find-person-node request)

        ;; find parents
        parents           (find-parent-entities node-id)
        {father :father
         mother :mother}  parents
        ]
    (util/response-success parents)))

(defn- get-children [request]
  (let [
        ;; find person node
        {node-id :id} (find-person-node request)


        ]
    (util/response-success {})))

(defn- detect-parent-role
  "Detect parent role."
  [request]
  (let [gender (-> request util/params :gender)
        _ (log-trace/add :info "(detect-parent-role)" "Gender " gender)

        role   (svc-pr/detect-parent-role-single {:gender gender})
        _ (log-trace/add :info "(detect-parent-role)" "Role " role)]
    (util/response-success {:role role})))

(def pedigree-api-routes
  (context "/api/pedigree" []
           (GET "/getParents" [] get-parents)
           (GET "/getChildren" [] get-children)
           (GET "/detect/parentRole" [] detect-parent-role)))
