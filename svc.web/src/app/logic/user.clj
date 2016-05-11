(ns app.logic.user
  (:require [app.services.user :as svc-user]
            [slingshot.slingshot :refer [throw+]]
            [environ.core :refer [env]]
            [buddy.auth :refer [authenticated?]]
            [app.definition.user :refer [get-role]]))

(defn- extract-user "Extract the user data from the returned data in svc user" [data]
  (let [user-info (:user data)
        user-role (get-in data [:user-role :role-name])
        user-info (assoc user-info :role user-role)]
    user-info))

(defn authenticate
  "Authenticate user with user and password, return the user data"
  [username password]
  (when (not (svc-user/authenticate username password))
    (throw+ "Username or password does not match"))
  (-> username
      svc-user/find-user
      extract-user))

(defn get-user-from-request
  "Get the current logged in user from the request"
  [request]
  (cond
    (-> :profile env (= "dev"))
    {:authenticated true
     :username "dev"
     :role "admin"
     :locale "vi"}
    (authenticated? request)
    (get-in request [:session :user-info])
    :else {:authenticated false})
  ;; (if (authenticated? request) (get-in request [:session :user-info]) {:authenticated false})
  )

(defn valid-password? [username password]
  (svc-user/authenticate username password))

(defn change-password
  "Change user's password"
  [username old-password new-password]
  (svc-user/change-password username old-password new-password))

(defn empty? "Check if there is no user in the system" []
  (svc-user/empty?))

(defn add "Add new user" [user role]
  (-> (svc-user/add user (get-role role))
      (extract-user)))
