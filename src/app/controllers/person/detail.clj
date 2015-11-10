(ns app.controllers.person.detail
  (:require [app.neo4j.main :as neo4j]
            [korma.db :as kd]
            [app.views.layout :as layout]
            [app.util.main :as util]))

(defn show-detail [request]
  (let [params (util/params request)
        person-id (params :personId)
        person-id (util/parse-int person-id)]
    (layout/render request "person/detail.html")
    ))
