(ns app.controllers.person.add.from-child
  (:require [app.neo4j.main :as neo4j]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.models.person :as person]
            [korma.db :as kd]
            [app.controllers.person.util :as controller-util]
            [app.models.pedigree-relation :as prl]))

(defn process-get-request [request]
  (let [child (controller-util/find-person-from-request request "childId")]
    (if (and child (-> child person/enough-parents? not))
      (render/render-add-page request {:action "add"
                                       :from "child"
                                       :child child})
      "enough parent")
    ))

(defn process-post-request [request]
  (kd/transaction
   (if-let [child (controller-util/find-person-from-request request :childId)]
     (let [person-result (controller-util/create-person-from-request request)
           person-entity (person-result :entity)
           parent-role (person-util/determine-father-mother-single person-entity)]
       (if (= parent-role :father)
         (prl/add-child-for-father person-entity child)
         (prl/add-child-for-mother person-entity child)))
     "child nil")))
