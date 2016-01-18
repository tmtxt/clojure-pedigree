(ns app.controllers.person.add.from-partner
  (:require [app.models.person :as person]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.controllers.person.util :as controller-util]
            [app.models.marriage-relation :as mrl]
            [korma.db :refer [transaction]]
            [slingshot.slingshot :refer [try+ throw+]]
            [app.views.layout :refer [render-message]]
            [ring.util.response :refer [redirect]]))

(defn process-get-request [request]
  (if-let [partner (controller-util/find-person-from-request request "partnerId")]
    (let [partner-role (person-util/determine-partner-role-single partner)]
      (render/render-add-page request {:action "add"
                                       :from "partner"
                                       :partner {partner-role partner}}))
    (render-message request "Có lỗi xảy ra" :type :error)))

(defn- find-partner
  "Find the partner entity from the request"
  [request]
  (if-let [partner (controller-util/find-person-from-request request :partnerId)]
    partner
    (throw+ "partner not found")))

(defn process-post-request [request]
  (transaction
   (try+
    (let [partner (find-partner request)
          person (-> request controller-util/create-person-from-request :entity)
          partner-role (person-util/determine-partner-role-single person)]
      (if (= partner-role :husband)
        (mrl/add-marriage partner person)
        (mrl/add-marriage person partner))
      (->> (:id person) (str "/person/detail/") redirect))
    (catch Object _ (render/render-error request)))))
