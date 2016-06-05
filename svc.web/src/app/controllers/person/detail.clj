(ns app.controllers.person.detail
  (:require [app.util.main :as util]
            [app.views.main :as view]
            [app.services.person :as svc-person]
            [slingshot.slingshot :refer [try+ throw+]]
            [app.services.pedigree-relation :as svc-pr]
            [app.services.marriage-relation :as svc-mr]
            [app.logger.log-trace :as log-trace]))

(defn- find-person "Find the person entity and node" [request]
  (-> request
      util/params
      :personId
      util/parse-int
      (svc-person/find-by-id :readable true)))

(defn- parent-type "Detect parent type" [type]
  (get {"mother_child" :mother} type :father))

(defn- find-parent-entities "Find the parents entities of this person node" [node]
  (let [node-id (:id node)
        relations (svc-pr/find-parents node-id)]
    (reduce
     #(let [{type :parent-type id :parent-id} %2
            key (parent-type type)]
        (assoc %1 key (-> id svc-person/find-by-id :entity)))
     {} relations)))

(defn- find-partner-entities "Find the partners entities of this person node" [node]
  (let [node-id     (:id node)
        relations   (svc-mr/find-partner-node node-id)
        partner-ids (map #(:partner-id %) relations)
        partners    (map #(svc-person/find-by-id %) partner-ids)
        partners    (map #(:entity %) partners)]
    partners))

(defn show-detail [request]
  (view/render-page "person_detail_view"))

(defn get-info [request]
  (let [
        ;; find the person info from the request
        person-info (find-person request)
        _ (when (not person-info) (throw+ "No person found"))

        ;; extract person
        {node   :node
         entity :entity}  person-info
        _ (log-trace/add :info "(show-detail)" "Person id" (:id entity))

        ;; find parents
        parents           (find-parent-entities node)
        {father :father
         mother :mother}  parents

        ;; find partners
        partners (find-partner-entities node)
        ]
    (util/response-success
     entity)))
