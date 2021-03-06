(ns app.handler
  (:require [compojure.core :refer [defroutes routes wrap-routes]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.file-info :refer [wrap-file-info]]
            [ring.middleware.session.memory :refer [memory-store]]
            [ring.middleware.json :refer [wrap-json-response]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.middleware.multipart-params :refer [wrap-multipart-params]]
            [compojure.route :as route]

            [app.controllers.home :refer [home-routes home-rules]]
            [app.controllers.person :refer [person-routes person-api-routes person-rules]]
            [app.controllers.pedigree :refer [pedigree-api-routes]]
            [app.controllers.marriage :refer [marriage-api-routes]]
            [app.controllers.minor-content :refer [minor-content-api-routes]]
            [app.controllers.auth :refer [auth-api-routes]]
            [app.controllers.admin :refer [admin-routes admin-rules]]
            [app.controllers.tree :refer [tree-routes tree-api-routes]]

            [ring.middleware.session :refer [wrap-session]]
            [buddy.auth.backends.session :refer [session-backend]]
            [buddy.auth.middleware :refer [wrap-authentication]]
            [buddy.auth.accessrules :refer [wrap-access-rules]]
            [app.util.security :as security]

            [app.logger.log-trace :as log-trace]))

(defn init []
  (println "app is starting"))

(defn destroy []
  (println "app is shutting down"))

(defroutes app-routes
  (route/resources "/")
  (route/files "/images" {:root "/app-data/images"})
  (route/files "/frontend" {:root "/app-data/frontend"})
  (route/not-found "Not Found"))

(def authentication-backend (session-backend))

(def authorization-rules (concat
                          admin-rules
                          home-rules
                          person-rules))

(def app
  (-> (routes (-> home-routes
                  (wrap-routes log-trace/wrap-log-trace))
              (-> auth-api-routes
                  (wrap-routes log-trace/wrap-log-trace))
              (-> person-routes
                  (wrap-routes log-trace/wrap-log-trace))
              (-> person-api-routes
                  (wrap-routes log-trace/wrap-log-trace))
              (-> pedigree-api-routes
                  (wrap-routes log-trace/wrap-log-trace))
              (-> marriage-api-routes
                  (wrap-routes log-trace/wrap-log-trace))
              (-> admin-routes
                  (wrap-routes log-trace/wrap-log-trace))
              (-> tree-routes
                  (wrap-routes log-trace/wrap-log-trace))
              (-> tree-api-routes
                  (wrap-routes log-trace/wrap-log-trace))
              (-> minor-content-api-routes
                  (wrap-routes log-trace/wrap-log-trace))
              app-routes)
      (wrap-access-rules {:rules authorization-rules :on-error security/unauthorized-handler})
      (wrap-authentication authentication-backend)
      (wrap-params)
      (wrap-multipart-params)
      (wrap-session)
      (wrap-json-response)))
