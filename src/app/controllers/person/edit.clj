(ns app.controllers.person.edit
  (:require [app.neo4j.main :as neo4j]
            [korma.db :as kd]
            [app.util.person :as person-util]
            [app.views.layout :as layout]
            [app.util.main :as util]
            [clojure.data.json :as json]
            [app.controllers.person.util :as controller-util]
            [app.models.person :as person-model]
            [app.util.db-util :as db-util]
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
