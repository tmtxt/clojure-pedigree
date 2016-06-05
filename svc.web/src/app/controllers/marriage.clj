(ns app.controllers.marriage
  (:require [compojure.core :refer :all]
            [app.util.main :as util]
            [app.services.marriage-relation :as svc-mr]
            [app.services.person :as svc-person]))

(defn- find-person-node [request]
  (-> request
      util/params
      :personId
      util/parse-int
      svc-person/find-node-by-id))

(defn- find-partner-entities "Find the partners entities of this person node" [node-id]
  (let [relations   (svc-mr/find-partner-node node-id)
        partner-ids (map #(:partner-id %) relations)
        partners    (map #(svc-person/find-by-id %) partner-ids)
        partners    (map #(:entity %) partners)]
    partners))

(defn- get-partners [request]
  (let [
        ;; find person node
        {node-id :id} (find-person-node request)

        ;; find partners
        partners (find-partner-entities node-id)
        ]
    (util/response-success partners)))

(def marriage-api-routes
  (context "/api/marriage" []
           (GET "/getPartners" [] get-partners)))
