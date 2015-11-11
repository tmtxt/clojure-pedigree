(ns app.controllers.person.detail
  (:require [app.neo4j.main :as neo4j]
            [korma.db :as kd]
            [app.views.layout :as layout]
            [app.util.main :as util]
            [app.controllers.person.util :as controller-util]))

(defn show-detail [request]
  (let [person (controller-util/find-person-from-request request "personId")]
    (when person (layout/render request
                                "person/detail.html"
                                {:person person}))))
