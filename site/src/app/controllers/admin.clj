(ns app.controllers.admin
  (:require [compojure.core :refer :all]
            [environ.core :refer [env]]
            [app.views.layout :refer [render]]
            [app.util.security :refer [user-access admin-access]]))

(defn view-index [request]
  (render request "admin/index.html"))

(defn change-password-render [request]
  (render request "admin/change_password.html"))

(def admin-routes
  (context
   "/admin" []
   (GET "/index" [] view-index)
   (GET "/changePassword" [] change-password-render)))

(def admin-rules
  (if (-> :profile env (= "dev"))
    [{:pattern #"^/admin/sfkjdslkjfldjfs.*"
      :handler admin-access}]
    [{:pattern #"^/admin/.*"
                  :handler {:and [user-access admin-access]}}]))
