(ns app.controllers.person.edit
  (:require [app.util.main :as util]
            [app.controllers.person.util :refer [find-person params-to-person-data]]
            [app.controllers.person.add.render :as render]
            [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [redirect]]
            [app.logger.log-trace :as log-trace]
            [app.services.person :as svc-person]
            [app.definition.person :as person-def]
            [app.controllers.person.add.render :as render]
            [app.helper.person :refer [update-person]]))

(defn handle-get-request [request]
  (try+
   (let [;; get the person id from the request
         person-id (-> request (util/param "personId") (util/parse-int))
         _ (log-trace/add :info "(handle-get-request)" (str "Person id " person-id))

         ;; find the person entity
         person-entity (-> person-id svc-person/find-by-id :entity)]

     ;; if cannot find person
     (when (not person-entity)
       (do
         (log-trace/add :error "(handle-get-request)" (str "Cannot find person with id " person-id))
         (throw+ (str "Cannot find person with id " person-id))))

     ;; render edit page using same layout with add page
     (render/add-page
      request
      {:from     "none"
       :person    person-entity
       :parent    {}
       :partner   {}
       :child     {}
       :action    "edit"}))
   (catch Object _ (render/error-page request))))

(defn handle-post-request [request]
  (try+
   (let [;; find person from request
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
     (->> person-id (str "/person/detail/") redirect))
   (catch Object _ (render/error-page request))))
