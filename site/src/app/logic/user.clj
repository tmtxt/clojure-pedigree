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
  (svc-user/find-user username))

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
