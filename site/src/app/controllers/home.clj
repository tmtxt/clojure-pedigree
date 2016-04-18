(ns app.controllers.home
  (:require [compojure.core :refer :all]
            [app.views.main :as view]
            [app.views.layout :as layout]
            [app.util.main :as util]
            [app.util.security :as security]
            [ring.util.response :refer [redirect]]
            [slingshot.slingshot :refer [try+]]
            [app.logic.preface-content :as preface]
            [app.logic.tree-desc-content :as tree-desc]
            [app.logic.user :as user]))

(defn home "Render index page" [request]
  (view/render-template request
                        "home/index.html"
                        {:preface (-> (preface/get) (:content))
                         :tree-desc (-> (tree-desc/get) :content)}))

(defn login-render "Render login page" [request]
  (view/render-template request "home/login.html"))

(defn login-authenticate "Process login" [request]
  (try+
   (let [params (util/params request)
         username (:username params)
         password (:password params)
         user-info (-> (user/authenticate username password)
                       (assoc :authenticated true))]
     (let [session (:session request)
           updated-session (assoc session
                                  :identity (:id user-info)
                                  :user-info user-info
                                  :locale (:locale user-info))]
       (-> (redirect "/welcome") (assoc :session updated-session))))
   (catch Object _
     (layout/render request "home/login.html"
                    {:message "Tên đăng nhập hoặc mật khẩu không đúng"}))))

;;; logout
(defn logout [request]
  (-> (redirect "/login")
      (assoc :session {})))

(defn welcome [request]
  (view/render-template request "home/welcome.html"))

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
