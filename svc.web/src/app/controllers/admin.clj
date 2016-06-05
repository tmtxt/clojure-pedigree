(ns app.controllers.admin
  (:require [compojure.core :refer :all]
            [environ.core :refer [env]]
            [app.util.security :refer [user-access admin-access]]

            [app.controllers.admin.profile :as profile]
            [app.controllers.admin.preface :as preface]
            [app.controllers.admin.tree-description :as tree-description]
            [app.views.main :as view]))

(defn view-index [request]
  (view/render-template request "admin/index.html"))

(def admin-routes
  (context
   "/admin" []
   (GET "/index" [] view-index)
   (GET "/changePassword" [] profile/change-password-render)
   (POST "/changePassword" [] profile/change-password-process)
   (GET "/prefaceManagement" [] preface/preface-render)
   (POST "/prefaceManagement" [] preface/preface-process)
   (GET "/treeDescManagement" [] tree-description/get-request)
   (POST "/treeDescManagement" [] tree-description/post-request)))

(def admin-rules
  [{:pattern #"^/admin/.*"
    :handler admin-access}])
