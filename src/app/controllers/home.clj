(ns app.controllers.home
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [selmer.parser :refer [render-file render]]
            ;; [noir.session :as session]
            [ring.util.response :refer [response redirect content-type]]
            [buddy.auth :refer [authenticated?]]
            [config.main :refer [config]]))

(defn home []
  (layout/render "home/index.html" {:name (config :site-name)}))

(defn login-authenticate [request]
  (let [session (:session request)
        updated-session (assoc session :identity "abc")]
    (println updated-session)
    (-> (redirect "/show") (assoc :session updated-session)))
  )

(defn show [request]
  (println "show")
  (println (:session request))
  (println (authenticated? request))
  )

(defn testr [request]
  (println "authen")
  (let [session (:session request)
        updated-session (assoc session :identity "abc")]
    (println updated-session)
    (let [temp (-> (redirect "/show") (assoc :session updated-session))]
      (println temp)
      temp)
    )
  )

(defroutes home-routes
  (GET "/" [] (home))
  ;; (GET "/write" [] (session/put! :user "hello"))
  (GET "/show" [] show)
  (POST "/login" [] login-authenticate)
  (GET "/test" [] testr))











