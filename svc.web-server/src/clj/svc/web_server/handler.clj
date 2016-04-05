(ns svc.web-server.handler
  (:require [compojure.core :refer [routes wrap-routes]]
            [svc.web-server.layout :refer [error-page]]
            [svc.web-server.routes.home :refer [home-routes]]
            [compojure.route :as route]
            [svc.web-server.middleware :as middleware]))

(def app-routes
  (routes
    (wrap-routes #'home-routes middleware/wrap-csrf)
    (route/not-found
      (:body
        (error-page {:status 404
                     :title "page not found"})))))

(def app (middleware/wrap-base #'app-routes))
