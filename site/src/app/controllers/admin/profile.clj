(ns app.controllers.admin.profile
  (:require [app.views.layout :refer [render]]
            [app.util.main :as util]
            [app.models.user :as user-model]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn change-password-render [request]
  (render request "admin/change_password.html"))

(defn change-password-process [request]
  ;; (let [id (-> request user-model/get-user-from-request :id)
  ;;       ]
  ;;   )
  )
