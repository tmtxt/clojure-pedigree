(ns app.util.security
  (:require [buddy.auth :refer [authenticated?]]
            [buddy.auth.accessrules :refer (error)]
            [slingshot.slingshot :refer [try+ throw+]]))

(def USER_ROLE_NAME_USER "user")
(def USER_ROLE_NAME_ADMIN "admin")

(defn unauthorized-handler [request value]
  {:status 403
   :headers {}
   :body "Not authorized"})

(defn user-access [request]
  (if (authenticated? request)
    true
    (error "Not logged in")))

(defn anonymous-access [request]
  (if (authenticated? request)
    (error "Already logged in")
    true))

(defn admin-access [request]
  (if (= (get-in request [:session :user-info :role] nil) USER_ROLE_NAME_ADMIN)
    true
    (error "For admin only")))
