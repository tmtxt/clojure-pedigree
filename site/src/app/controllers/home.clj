(ns app.controllers.home
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [app.util.main :as util]
            [app.util.security :as security]
            [ring.util.response :refer [response redirect content-type]]
            [buddy.auth :refer [authenticated?]]
            [config.main :refer [config]]
            [app.i18n.main :refer [make-t make-page-tran]]
            [config.main :refer [config]]
            [app.models.minor-content :refer [find-content]]))

(def preface-key (:preface-key config))

;;; index
(defn home [request]
  (layout/render request
                 "home/index.html"
                 {:preface (-> preface-key find-content :content)}
                 (make-page-tran request :page-index)))

;;; login
(defn login-render [request]
  (layout/render request "home/login.html"))

(defn login-authenticate [request]
  (let [username (util/param request "username")
        password (util/param request "password")
        user-info (security/authen-user username password)
        t (make-t request)]
    (if user-info
      (let [session (:session request)
            updated-session (assoc session
                                   :identity (:id user-info)
                                   :user-info user-info
                                   :locale (:locale user-info))]
        (-> (redirect "/welcome") (assoc :session updated-session)))
      (layout/render request "home/login.html" {:message (t :login/invalid-error)}))))

;;; logout
(defn logout [request]
  (-> (redirect "/login")
      (assoc :session {})))

(defn welcome [request]
  (layout/render request "home/welcome.html"))

(defn message [request]
  (layout/render-message request "hello" :redirect "/tree/view/" :text "Cây gia phả"))

(defroutes home-routes
  (GET "/" [] home)

  (GET "/login" [] login-render)
  (POST "/login" [] login-authenticate)
  (GET "/logout" [] logout)
  (POST "/logout" [] logout)

  (GET "/welcome" [] welcome)
  (GET "/message" [] message))

(def home-rules [{:uri "/login"
                  :handler security/anonymous-access
                  :redirect "/welcome"}])
