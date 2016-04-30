(ns app.controllers.person.add.from-partner
  (:require [app.controllers.person.util :refer [find-person create-person]]
            [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [redirect]]
            [app.services.marriage-relation :as svc-mr]
            [app.controllers.person.add.render :as render]))

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
  (try+
   (let [{partner-node   :node
          partner-entity :entity} (find-person request "partnerId")
         {person-node   :node
          person-entity :entity}  (create-person request)
         partner-role             (svc-mr/detect-partner-role-single partner-entity)]
     (if (= partner-role "husband")
       (svc-mr/add-relation partner-node person-node)
       (svc-mr/add-relation person-node  partner-node))
     (->> (:id person-entity)
          (str "/person/detail/")
          redirect))
   (catch Object _ (render/error-page request))))
