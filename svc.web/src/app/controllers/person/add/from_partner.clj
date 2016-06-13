(ns app.controllers.person.add.from-partner
  (:require [app.controllers.person.util :refer [find-person create-person]]
            [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [redirect]]
            [app.services.marriage-relation :as svc-mr]
            [app.controllers.person.add.render :as render]
            [app.logger.log-trace :as log-trace]))

(defn process-get-request [request]
  (try+
   (let [{partner :entity} (find-person request "partnerId")
         _                 (when (not partner) (throw+ "partner id nil"))
         role              (svc-mr/detect-partner-role-single partner)]
     (render/add-page request {:action "add"
                               :from "partner"
                               :partner {role partner}}))
   (catch Object _ (render/error-page request))))

(defn process-post-request [request]
  (let [;; find partner (to add from) from the request
        _ (log-trace/add :info "Find partner")
        {partner-node   :node
         partner-entity :entity} (find-person request "partnerId")
        _ (log-trace/add :info "Partner entity id" (:id partner-entity))
        _ (log-trace/add :info "Partner node id" (:id partner-node))

        ;; create new person from request
        _ (log-trace/add :info "Create new person")
        {person-node   :node
         person-entity :entity}  (create-person request)
        _ (log-trace/add :info "Person entity id" (:id person-entity))
        _ (log-trace/add :info "Person node id" (:id person-node))

        ;; detect partner role
        partner-role             (svc-mr/detect-partner-role-single partner-entity)
        _ (log-trace/add :info "Partner role" partner-role)
        ]

    ;; add relation between 2 nodes
    (log-trace/add :info "Add relation for two nodes")
    (if (= partner-role "husband")
      (svc-mr/add-relation partner-node person-node)
      (svc-mr/add-relation person-node  partner-node))

    ;; redirect to person detail page
    (->> (:id person-entity)
         (str "/person/detail/")
         redirect)))
