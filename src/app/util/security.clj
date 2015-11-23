(ns app.util.security
  (:require [crypto.password.bcrypt :as crypto]
            [app.models.user :as user-model]
            [app.models.userRole :as user-role-model]
            [buddy.auth :refer [authenticated?]]
            [buddy.auth.accessrules :refer (error)]
            [app.util.db-util :as db-util]))

(defn authen-user
  "Authenticate the input username and password. Return user entity if authenticated, otherwise, return nil"
  [username password]
  (let [user (user-model/find-by-username username)]
    (if (and user (crypto/check password (:password user)))
      {:id (:id user)
       :username (:username user)
       :role (:role_name user)
       :authenticated true
       :locale (:language user)}
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

(defn admin-access [request]
  (if (= (get-in request [:session :user-info :role] nil) user-role-model/USER_ROLE_NAME_ADMIN)
    true
    (error "For admin only")))
