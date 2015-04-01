(ns app.controllers.home
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [selmer.parser :refer [render-file render]]
            [noir.session :as session]
            [config.main :refer [config]]))

(defn home []
  (layout/render "home/index.html" {:name (config :site-name)}))

(defroutes home-routes
  (GET "/" [] (home))
  (GET "/write" [] (session/put! :user "hello"))
  (GET "/show" [] (str (session/get :user))))
