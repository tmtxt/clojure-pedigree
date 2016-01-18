(ns app.controllers.person.add.from-partner
  (:require [app.models.person :as person]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.controllers.person.util :as controller-util]
            [app.models.marriage-relation :as mrl]
            [korma.db :as kd]
            [slingshot.slingshot :refer [try+ throw+]]
            [app.views.layout :refer [render-message]]))

(defn process-get-request [request]
  (if-let [partner (controller-util/find-person-from-request request "partnerId")]
    (let [partner-role (person-util/determine-partner-role-single partner)]
      (render/render-add-page request {:action "add"
                                       :from "partner"
                                       :partner {partner-role partner}}))
    (render-message request "Có lỗi xảy ra" :type :error)))

(defn process-post-request [request]
  (kd/transaction
   (let [partner (controller-util/find-person-from-request request :partnerId)]
     (if (nil? partner)
       "partner nil"
       (let [person-result (controller-util/create-person-from-request request)
             person-entity (person-result :entity)
             partner-role (person-util/determine-partner-role-single person-entity)]
         (if (= partner-role :husband)
           (mrl/add-marriage partner person-entity)
           (mrl/add-marriage person-entity partner)))))))
