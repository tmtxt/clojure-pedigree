(ns app.controllers.person.edit
  (:require [app.neo4j.main :as neo4j]
            [korma.db :as kd]
            [app.util.person :as person-util]
            [app.views.layout :as layout]
            [app.util.main :as util]
            [clojure.data.json :as json]
            [app.controllers.person.util :as controller-util]
            [app.models.person :as person-model]
            [app.util.pg :as db-util]
            [clj-time.format :as f]
            [clj-time.coerce :as c]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn handle-get-request [request]
  (let [person (controller-util/find-person-from-request request "personId")]
    (when person
      (layout/render
       request
       "person/edit_detail.html"
       {:from "none"
        :person (-> person person-model/json-friendlify json/write-str)
        :parent (-> {} person-util/filter-parent-keys json/write-str)
        :partner (-> {} person-util/filter-partner-keys json/write-str)
        :child (-> {} person-util/filter-person-keys json/write-str)
        :statuses (-> request person-util/status-display json/write-str)
        :genders (-> request person-util/gender-display json/write-str)
        :action "edit"}
       ))))

(defn handle-post-request [request]
  (let [person (controller-util/find-person-from-request request "personid")]
    (if person
      (let [params (util/params request)
            file-name (controller-util/update-person-picture params person)
            params (assoc params :picture file-name)
            person-data (controller-util/params-to-person-data params)
            person-id (:id person)
            result (person-model/update-person person-id person-data)
            success (:success result)]
        (if success
          "person updated"
          (:message result)))
      (str "Person not found"))))
