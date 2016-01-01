(ns app.controllers.admin
  (:require [compojure.core :refer :all]
            [app.util.security :refer [user-access admin-access]]))

(defn view-index [request]
  "Admin index")

(def admin-routes
  (context
   "/admin" []
   (GET "/index" [] view-index)))

(def admin-rules [{:pattern #"^/admin/.*"
                  :handler {:and [user-access admin-access]}}])
