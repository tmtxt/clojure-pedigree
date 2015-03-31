(ns app.controllers.person
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [selmer.parser :refer [render-file render]]
            [noir.session :as session]
            [app.db])
  (:use [app.models.person]
        [korma.core]))

(defn list-person []
  (str (select person)))

(defroutes person-routes
  (GET "/person/list" [] (list-person)))
