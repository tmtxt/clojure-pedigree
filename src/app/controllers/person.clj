(ns app.controllers.person
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [noir.session :as session]
            [app.util.main :as util]
            [app.models.person :refer [person]]
            [korma.core :as kc]))

(defn list-person []
  (str (kc/select person)))

(defn add-child [request]
  (layout/render request
                 "person/add_child.html"))

(defn add-parent [request]
  "hello")

(defn add-partner [request]
  "hello")

(def person-routes
  (context "/person" []
           (GET "/list" [] (list-person))
           (GET "/addChild/parentId/:parentId" [] add-child)
           (GET "/addParent/childId/:childId" [] add-parent)
           (GET "/addPartner/partnerId/:partnerId" [] add-partner)))
