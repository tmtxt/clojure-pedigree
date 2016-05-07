(ns app.controllers.person.edit
  (:require [korma.db :as kd]
            [app.util.person :as person-util]
            [app.views.layout :as layout]
            [app.util.main :as util]
            [clojure.data.json :as json]
            [app.controllers.person.util :as controller-util]
            [app.controllers.person.add.render :as render]
            [app.models.person :as person-model]
            [app.util.pg :as db-util]
            [clj-time.format :as f]
            [clj-time.coerce :as c]
            [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [redirect]]))

(defn handle-get-request [request]
  (let [person-id (util/param request "personId")
        person-result (-> person-id util/parse-int person-model/find-person-by-id)
        person-entity (:entity person-result)]
    (when person-entity
      (layout/render
       request
       "person/edit_detail.html"
       {:from "none"
        :person (-> person-entity
                    (person-model/json-friendlify :fields [:birth-date :death-date :created-at]
                                                  :keep-nil true)
                    json/write-str)
        :parent (-> {} person-util/filter-parent-keys json/write-str)
        :partner (-> {} person-util/filter-partner-keys json/write-str)
        :child (-> {} person-util/filter-person-keys json/write-str)
        :statuses (-> request person-util/status-display json/write-str)
        :genders (-> request person-util/gender-display json/write-str)
        :action "edit"}
       ))))

(defn- find-person
  "Find the person to edit from the request"
  [request]
  (if-let [person (controller-util/find-person-from-request request "personid")]
    person
    (throw+ "person not found")))

(defn handle-post-request [request]
  (kd/transaction
   (try+
    (let [person (find-person request)
          params (util/params request)
          file-name (controller-util/update-person-picture params person)
          params (assoc params :picture file-name)
          person-data (controller-util/params-to-person-data params)
          person-id (:id person)
          result (person-model/update-person person-id person-data)
          success (:success result)]
      (if success
        (->> person-id (str "/person/detail/") redirect)
        (throw+ "error")))
    (catch Object _ (render/render-error request)))))