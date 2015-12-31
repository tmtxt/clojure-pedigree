(ns app.controllers.person.add.from-partner
  (:require [app.neo4j.main :as neo4j]
            [app.models.person :as person]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.controllers.person.util :as controller-util]
            [app.models.marriage-relation :as mrl]
            [korma.db :as kd]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn process-get-request [request]
  (neo4j/with-transaction
    (let [partner (controller-util/find-person-from-request request "partnerId")]
      (if partner
        (let [partner-role (person-util/determine-partner-role-single partner)]
          (render/render-add-page request {:action "add"
                                      :from "partner"
                                      :partner {partner-role partner}}))
        (render/render-add-page request)))))

(defn process-post-request [request]
  (neo4j/with-transaction
    (kd/transaction
     (let [partner (controller-util/find-person-from-request request :partnerId)]
       (if (nil? partner)
         "partner nil"
         (let [person-result (controller-util/create-person-from-request request)
               person-entity (person-result :entity)
               person-node (person-result :node)
               partner-node (person/find-node-by-person-id (:id partner))
               partner-role (person-util/determine-partner-role-single person-entity)]
           (if (= partner-role :husband)
             (mrl/add-marriage partner-node person-node)
             (mrl/add-marriage person-node partner-node))))))))
