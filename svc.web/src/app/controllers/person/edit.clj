(ns app.controllers.person.edit
  (:require [app.util.main :as util]
            [app.controllers.person.util :refer [find-person params-to-person-data]]
            [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [redirect]]
            [app.logger.log-trace :as log-trace]
            [app.services.person :as svc-person]
            [app.definition.person :as person-def]
            [app.helper.person :refer [update-person]]
            [app.views.main :as view]))

(defn handle-get-request [request]
  (view/render-page "person_edit_view"))

(defn handle-post-request [request]
  (let [
        ;; find person from request
        person (find-person request "personid")
        old-person (:entity person)
        _ (log-trace/add :info "handle-post-request" (str "Found person with id " (:id old-person)))

        ;; person data
        params (util/params request)
        new-person (params-to-person-data params)

        ;; person id
        person-id  (:personid params)
        new-person (assoc new-person :id person-id)

        ;; update
        _ (update-person old-person new-person)
        ]
    (->> person-id (str "/person/detail/") redirect)))
