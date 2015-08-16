(ns app.controllers.home
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [app.util.main :as util]
            [app.util.security :as security]
            [ring.util.response :refer [response redirect content-type]]
            [buddy.auth :refer [authenticated?]]
            [config.main :refer [config]]
            [app.i18n.main :refer [make-t make-page-tran]]))

;;; index
(defn home [request]
  (layout/render request
                   "home/index.html"
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
                                   :identity (user-info :id)
                                   :user-info user-info
                                   :locale (user-info :locale))]
        (-> (redirect "/welcome") (assoc :session updated-session)))
      (layout/render request "home/login.html" {:message (t :login/invalid-error)}))))

;;; logout
(defn logout [request]
  (-> (redirect "/login")
      (assoc :session {})))

(defn welcome [request]
  (layout/render request "home/welcome.html"))

(defroutes home-routes
  (GET "/" [] home)

  (GET "/login" [] login-render)
  (POST "/login" [] login-authenticate)
  (GET "/logout" [] logout)
  (POST "/logout" [] logout)

  (GET "/welcome" [] welcome))

(def home-rules [{:uri "/login"
                  :handler security/anonymous-access
                  :redirect "/welcome"}])
