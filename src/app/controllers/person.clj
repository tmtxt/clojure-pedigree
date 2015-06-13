(ns app.controllers.person
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [selmer.parser :refer [render-file render]]
            [noir.session :as session]
            [app.models.person :refer [person]]
            [korma.core :as kc]))

(defn list-person []
  (str (kc/select person)))

(def person-routes
  (context "/person" []
           (GET "/list" [] (list-person))))
