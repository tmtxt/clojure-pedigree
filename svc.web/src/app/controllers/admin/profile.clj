(ns app.controllers.admin.profile
  (:require [app.views.main :as view]
            [app.util.main :as util]
            [slingshot.slingshot :refer [try+ throw+]]
            [app.helper.user :as user-logic]))

(defn- present [value]
  (not (or (not value) (empty? value))))

(defn- validate-change-password [request]
  (let [params (util/params request)
        {:keys [current-password new-password confirm-password]} params
        username (-> (user-logic/get-user-from-request request)
                     (:username))]
    (when-not (present current-password)
      (throw+ {:current-password "Không được để trống"}))
    (when-not (present new-password)
      (throw+ {:new-password "Không được để trống"}))
    (when-not (present confirm-password)
      (throw+ {:confirm-password "Không được để trống"}))
    (when-not (= new-password confirm-password)
      (throw+ {:confirm-password "Mật khẩu không khớp"}))
    (when-not (user-logic/valid-password? username current-password)
      (throw+ {:current-password "Mật khẩu không đúng"}))))

(defn- change-password [request]
  (let [params (util/params request)
        {:keys [current-password new-password confirm-password]} params
        username (-> (user-logic/get-user-from-request request)
                     (:username))]
    (when-not (user-logic/change-password username current-password new-password)
      (throw+ {:global-error "Có lỗi xảy ra"}))))

(defn change-password-render [request]
  (view/render-template request "admin/change_password.html"))

(defn change-password-process [request]
  (try+
   (validate-change-password request)
   (change-password request)
   (view/render-message request "Thay đổi mật khẩu thành công"
                        :redirect "/admin/index"
                        :text "Trang admin")
   (catch map? errors
     (view/render-template request "admin/change_password.html" errors))))
