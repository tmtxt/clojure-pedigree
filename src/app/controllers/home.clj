(ns app.controllers.home
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [selmer.parser :refer [render-file render]]
            ;; [noir.session :as session]
            [ring.util.response :refer [response redirect content-type]]
            [buddy.auth :refer [authenticated?]]
            [config.main :refer [config]]))

(defn home [request]
  (layout/render "home/index.html" {:name (config :site-name)}))

(defn login-render [request]
  (println "login")
  (println (:session request))
  (if (authenticated? request)
    (redirect "/welcome")
    (layout/render "home/login.html")))

(defn login-authenticate [request]
  (println "post")
  (let [session (:session request)
        updated-session (assoc session :identity "abc")]
    (-> (redirect "/welcome") (assoc :session updated-session))))

(defn welcome [request]
  (layout/render "home/welcome.html"))

(defroutes home-routes
  (GET "/" [] home)
  (GET "/login" [] login-render)
  (GET "/welcome" [] welcome)
  (POST "/login" [] login-authenticate))











