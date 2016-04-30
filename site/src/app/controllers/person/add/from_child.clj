(ns app.controllers.person.add.from-child
  (:require [app.controllers.person.add.render :as render]
            [app.controllers.person.util :refer [find-person create-person]]
            [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [redirect]]
            [app.services.pedigree-relation :as svc-pr]))

(defn process-get-request [request]
  (try+
   (let [{child-node :node
          child      :entity} (find-person request "childId")
         _  (when-not child (throw+ 1))
         _  (when (= (svc-pr/count-parents child-node) 2)
              (throw+ "Thành viên đã có đủ cha mẹ"))]
     (render/add-page request {:action "add"
                               :from "child"
                               :child child}))
   (catch string? mes (render/error-page request mes))
   (catch Object _ (render/error-page request))))

(defn process-post-request [request]
  (try+
   (let [{child-node   :node
          child-entity :entity} (find-person request "childId")
         {person-node   :node
          person-entity :entity} (create-person request)
         parent-role (-> (svc-pr/detect-parent-role-single person-entity)
                         (keyword))]
     (if (= parent-role :father)
       (svc-pr/add-from-father child-node person-node)
       (svc-pr/add-from-mother child-node person-node))
     (redirect (str "/person/detail/" (person-entity :id))))
   (catch Object _ (render/error-page request))))
