(ns app.controllers.admin
  (:require [compojure.core :refer :all]
            [environ.core :refer [env]]
            [app.views.layout :refer [render]]
            [app.util.security :refer [user-access admin-access]]

            [app.controllers.admin.profile :as profile]
            [app.controllers.admin.preface :as preface]))

(defn view-index [request]
  (render request "admin/index.html"))

(def admin-routes
  (context
   "/admin" []
   (GET "/index" [] view-index)
   (GET "/changePassword" [] profile/change-password-render)
   (POST "/changePassword" [] profile/change-password-process)
   (GET "/prefaceManagement" [] preface/preface-render)
   (POST "/prefaceManagement" [] preface/preface-process)))

(def admin-rules
  (if (-> :profile env (= "dev"))
    [{:pattern #"^/admin/sfkjdslkjfldjfs.*"
      :handler admin-access}]
    [{:pattern #"^/admin/.*"
      :handler {:and [user-access admin-access]}}]))
