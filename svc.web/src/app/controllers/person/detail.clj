(ns app.controllers.person.detail
  (:require [app.util.main :as util]
            [app.views.main :as view]
            [app.services.person :as svc-person]
            [slingshot.slingshot :refer [throw+]]
            [app.logger.log-trace :as log-trace]))

(defn- find-person "Find the person entity and node" [request]
  (-> request
      util/params
      :personId
      util/parse-int
      (svc-person/find-by-id :readable true)))

(defn show-detail [request]
  (view/render-page "person_detail_view"))

(defn get-info [request]
  (let [
        ;; find the person info from the request
        person-info (find-person request)
        _ (when (not person-info) (throw+ "No person found"))

        ;; extract person
        {entity :entity}  person-info
        _ (log-trace/add :info "(show-detail)" "Person id" (:id entity))
        ]
    (util/response-success entity)))
