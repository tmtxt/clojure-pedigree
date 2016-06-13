(ns app.controllers.person.add.from-child
  (:require [app.controllers.person.util :refer [find-person create-person]]
            [ring.util.response :refer [redirect]]
            [app.services.pedigree-relation :as svc-pr]
            [app.logger.log-trace :as log-trace]))

(defn process-post-request [request]
  (let [
        ;; find the child node
        {child-node   :node
         child-entity :entity} (find-person request "fromPersonId")
        _ (log-trace/add :info "(process-post-request)" "Child id" (:id child-entity))

        ;; create the person
        {person-node   :node
         person-entity :entity} (create-person request)
        _ (log-trace/add :info "(process-post-request)" "Person created with id" (:id person-entity))

        ;; detect the parent role
        parent-role (-> (svc-pr/detect-parent-role-single person-entity)
                        (keyword))
        _ (log-trace/add :info "(process-post-request)" "Parent role" parent-role)
        ]
    (if (= parent-role :father)
      (svc-pr/add-from-father child-node person-node)
      (svc-pr/add-from-mother child-node person-node))
    (redirect (str "/person/detail/" (person-entity :id)))))
