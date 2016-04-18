(ns app.controllers.admin.profile
  (:require [app.views.layout :refer [render render-message]]
            [app.views.main :as view]
            [app.util.main :as util]
            [app.models.user :as user-model]
            [slingshot.slingshot :refer [try+ throw+]]
            [validateur.validation :as vl]))

(defn- create-password-validator [user]
  (vl/validation-set
   (vl/presence-of :current-password :message "Không được để trống")
   (vl/presence-of :new-password :message "Không được để trống")
   (vl/presence-of :confirm-password :message "Không được để trống")
   (vl/validate-by :current-password
                   #(user-model/correct-password? user %)
                   :message "Mật khẩu không đúng")))

(defn- validate-confirm-password [params errors]
  (if (empty? errors)
    (if (= (:new-password params)
           (:confirm-password params))
      errors
      (assoc errors :confirm-password #{"Mật khẩu không khớp"}))
    errors))

(defn- validate-change-password [request]
  (let [params (util/params request)
        user (user-model/get-user-from-request request)
        validator (create-password-validator user)
        errors (validator params)
        errors (validate-confirm-password params errors)
        errors (into {} (for [[k v] errors] [k (first v)]))]
    errors))

(defn change-password-render [request]
  (view/render-template request "admin/change_password.html"))

(defn change-password-process [request]
  (try+
   (let [errors (validate-change-password request)
         _ (when (-> errors empty? not) (throw+ errors))
         password (-> request util/params :new-password)
         user (user-model/get-user-from-request request)
         _ (user-model/change-password user password)]
     (render-message request "Thay đổi mật khẩu thành công"
                     :redirect "/admin/index"
                     :text "Trang admin"))
   (catch map? errors
     (render request "admin/change_password.html" errors))
   ))
