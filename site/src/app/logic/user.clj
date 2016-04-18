(ns app.logic.user
  (:require [app.services.user :as svc-user]
            [slingshot.slingshot :refer [throw+]]
            [environ.core :refer [env]]
            [buddy.auth :refer [authenticated?]]))

(defn authenticate
  "Authenticate user with user and password, return the user data"
  [username password]
  (when (not (svc-user/authenticate username password))
    (throw+ "Username or password does not match"))
  (let [user-data (svc-user/find-user username)
        user-info (:user user-data)
        user-role (get-in user-data [:userRole :roleName])
        user-info (assoc user-info :role user-role)]
    user-info))

(defn get-user-from-request
  "Get the current logged in user from the request"
  [request]
  ;; (cond
  ;;   (-> :profile env (= "dev"))
  ;;   {:authenticated true
  ;;    :username "dev"
  ;;    :role "admin"
  ;;    :locale "vi"}
  ;;   (authenticated? request)
  ;;   (get-in request [:session :user-info])
  ;;   :else {:authenticated false})
  (if (authenticated? request) (get-in request [:session :user-info]) {:authenticated false})
  )

(defn change-password
  "Change user's password"
  [username old-password new-password]
  (svc-user/change-password username old-password new-password))
