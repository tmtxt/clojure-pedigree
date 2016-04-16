(ns app.logic.user
  (:require [app.services.user :as svc-user]
            [slingshot.slingshot :refer [throw+]]))

(defn authenticate
  "Authenticate user with user and password, return the user data"
  [username password]
  (when (not (svc-user/authenticate username password))
    (throw+ "Username or password does not match"))
  (svc-user/find-user username))
