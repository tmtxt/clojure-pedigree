(ns app.controllers.person
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [noir.session :as session]
            [app.models.person :refer [person]]
            [korma.core :as kc]))

(defn list-person []
  (str (kc/select person)))

(defn add-person [request]
  "Hello")

(def person-routes
  (context "/person" []
           (GET "/list" [] (list-person))
           (GET "/add" [] add-person)))
