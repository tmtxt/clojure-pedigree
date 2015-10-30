(ns app.controllers.person.add.from-partner
  (:require [app.neo4j.main :as neo4j]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.controllers.person.util :as controller-util]))

(defn process-get-request [request]
  (neo4j/with-transaction
    (let [partner (controller-util/find-person-from-request request "partnerId")]
      (if partner
        (let [partner-role (person-util/determine-partner-role-single partner)]
          (render/render-add-page request {:action "add"
                                      :from "partner"
                                      :partner {partner-role partner}}))
        (render/render-add-page request)))))
