(ns app.controllers.person
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [selmer.parser :refer [render-file render]]
            [noir.session :as session]
            [app.db]
            [app.models.person :refer [person]]
            [korma.core :as kc]))

(defn list-person []
  (str (kc/select person)))

(defroutes person-routes
  (GET "/person/list" [] (list-person)))
