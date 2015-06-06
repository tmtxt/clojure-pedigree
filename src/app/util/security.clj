(ns app.util.security
  (:require [crypto.password.bcrypt :as crypto]
            [app.models.user :as user-model]
            [buddy.auth :refer [authenticated?]]
            [buddy.auth.accessrules :refer (error)]
            [app.util.dbUtil :as db-util]))

(defn authen-user
  "Authenticate the input username and password. Return user entity if authenticated, otherwise, return nil"
  [username password]
  (let [user (user-model/find-by-username username)]
    (if (and user (crypto/check password (:password user)))
      {:id (:id user)
       :username (:username user)
       :role (:role_name user)}
      nil)))

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













