(ns app.controllers.person.util
  (:require [app.util.main :as util]
            [app.models.person :as person]))

(defn find-person-from-request [request param-name]
  (-> request
      (util/param param-name)
      (util/parse-int)
      (person/find-by-person-id)))
