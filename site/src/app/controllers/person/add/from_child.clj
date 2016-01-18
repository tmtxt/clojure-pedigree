(ns app.controllers.person.add.from-child
  (:require [app.neo4j.main :as neo4j]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.models.person :as person]
            [korma.db :as kd]
            [app.controllers.person.util :refer [find-person-from-request create-person-from-request]]
            [app.models.pedigree-relation :as prl]
            [app.views.layout :refer [render-message]]))

(defn process-get-request [request]
  (let [child (find-person-from-request request "childId")]
    (cond
      (not child)
      (render-message request "Có lỗi xảy ra" :type :error)

      (-> child person/enough-parents?)
      (render-message request "Thành viên này đã có đủ cha mẹ" :type :error)

      :else
      (render/render-add-page request {:action "add"
                                       :from "child"
                                       :child child}))))

(defn process-post-request [request]
  (kd/transaction
   (if-let [child (find-person-from-request request :childId)]
     (let [person-result (create-person-from-request request)
           person-entity (person-result :entity)
           parent-role (person-util/determine-father-mother-single person-entity)]
       (if (= parent-role :father)
         (prl/add-child-for-father person-entity child)
         (prl/add-child-for-mother person-entity child)))
     "child nil")))
