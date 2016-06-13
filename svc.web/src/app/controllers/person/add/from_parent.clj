(ns app.controllers.person.add.from-parent
  (:require [app.controllers.person.util :refer [find-person create-person]]
            [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [redirect]]
            [app.services.pedigree-relation :as svc-pr]
            [app.logger.log-trace :as log-trace]))

(defn- add-parent [request key person-node func]
  (try+
   (let [;; find parent from request
         {parent-node :node} (find-person request key)
         _ (log-trace/add :info "(add-parent)"
                          (str "Parent node id " (:id parent-node)))

         ;; create relation
         rel (func person-node parent-node)
         ]
     rel)
   (catch Object _ nil)))

(defn process-post-request [request]
  (let [;; create the person
        _ (log-trace/add :info "(process-post-request)" "Creating person")
        {person-node   :node
         person-entity :entity} (create-person request)
        _ (log-trace/add :info "(process-post-request)"
                         (str "Person created!"))
        _ (log-trace/add :info "(process-post-request)"
                         (str "Person node id " (:id person-node)))
        _ (log-trace/add :info "(process-post-request)"
                         (str "Person entity id " (:id person-entity)))

        ;; add relation for father if any
        _ (log-trace/add :info "(process-post-request)" "Adding relation for father if any")
        father-rel (add-parent request "fatherId" person-node svc-pr/add-from-father)

        ;; add relation for mother if any
        _ (log-trace/add :info "(process-post-request)" "Adding relation for mother if any")
        mother-rel (add-parent request "motherId" person-node svc-pr/add-from-mother)]

    (when (every? nil? [father-rel mother-rel]) (throw+ "nil all"))
    (redirect (str "/person/detail/" (person-entity :id)))))
