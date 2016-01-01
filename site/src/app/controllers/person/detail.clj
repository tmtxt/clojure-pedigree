(ns app.controllers.person.detail
  (:require [app.neo4j.main :as neo4j]
            [korma.db :as kd]
            [app.views.layout :as layout]
            [app.models.person :as person]
            [app.util.main :as util]
            [app.controllers.person.util :as controller-util]))

(defn show-detail [request]
  (neo4j/with-transaction
    (let [person-info (-> request
                          util/params
                          :personId
                          util/parse-int
                          (person/find-person-by-id :json-friendly true
                                                    :include-partners true
                                                    :include-parents true))
          person (get person-info :entity)
          parents (get person-info :parents)
          father (get parents :father)
          mother (get parents :mother)
          partners (get person-info :partners)]
      (when person (layout/render request
                                  "person/detail.html"
                                  {:person person
                                   :father father
                                   :mother mother
                                   :partners partners})))))
