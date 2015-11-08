(ns app.controllers.person.add.from-child
  (:require [app.neo4j.main :as neo4j]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.models.person :as person]
            [korma.db :as kd]
            [app.controllers.person.util :as controller-util]
            [app.models.pedigree-relation :as prl]))

(defn process-get-request [request]
  (neo4j/with-transaction
    (let [child (controller-util/find-person-from-request request "childId")]
      (if (and child (-> child person/enough-parents? not))
        (render/render-add-page request {:action "add"
                                         :from "child"
                                         :child child})
        (render/render-add-page request))
      )))

(defn process-post-request [request]
  (neo4j/with-transaction
    (kd/transaction
     (if-let [child (controller-util/find-person-from-request request :childId)]
       (let [person-result (controller-util/create-person-from-request request)
             person-entity (person-result :entity)
             person-node (person-result :node)
             child-node (person/find-node-by-person-id (:id child))
             parent-role (person-util/determine-father-mother-single person-entity)]
         (if (= parent-role :father)
           (prl/add-child-for-father person-node child-node)
           (prl/add-child-for-mother person-node child-node)))
       "child nil"))))
