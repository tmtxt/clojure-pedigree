(ns app.controllers.person.util
  (:require [app.util.main :as util]
            [app.models.person :as person]))

(defn find-person-from-request [request param-name]
  (let [param-name (keyword param-name)
        params (util/params request)
        param (get params param-name)]
    (-> param util/parse-int person/find-by-person-id)))
