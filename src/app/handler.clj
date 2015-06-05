(ns app.handler
  (:require [compojure.core :refer [defroutes routes]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.file-info :refer [wrap-file-info]]
            [ring.middleware.session.memory :refer [memory-store]]
            [hiccup.middleware :refer [wrap-base-url]]
            [compojure.handler :as handler]
            [ring.middleware.params :refer [wrap-params]]
            [compojure.route :as route]
            [app.controllers.home :refer [home-routes]]
            [app.controllers.person :refer [person-routes]]
            [ring.middleware.session :refer [wrap-session]]
            [noir.session :as session]
            [buddy.auth.backends.session :refer [session-backend]]
            [buddy.auth.middleware :refer [wrap-authentication]]
            [noir.validation :as validation]))

(defn init []
  (println "app is starting"))

(defn destroy []
  (println "app is shutting down"))

(defroutes app-routes
  (route/resources "/")
  (route/not-found "Not Found"))

(def backend (session-backend))

(def app
  (-> (routes home-routes
              person-routes
              app-routes)
      (wrap-authentication backend)
      (wrap-params)
      (wrap-session)))
