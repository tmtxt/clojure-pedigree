(ns app.util.security
  (:require [crypto.password.bcrypt :as crypto]
            [app.models.user :as user-model]
            [buddy.auth :refer [authenticated?]]
            [buddy.auth.accessrules :refer (error)]
            [app.util.dbUtil :as db-util]))

(defn authen-user
  "Authenticate the input username and password"
  [username password]
  (let [user (db-util/find-by-attrs user-model/user {:username username})]
    (if user
      (crypto/check password (:password user))
      false)))

(defn unauthorized-handler [request value]
  {:status 403
   :headers {}
   :body "Not authorized"})

(defn user-access [request]
  (if (authenticated? request)
    true
    (error "Not logged in")))















