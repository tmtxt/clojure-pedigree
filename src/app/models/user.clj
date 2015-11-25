(ns app.models.user
  (:use [korma.core])
  (:require [app.models.user-role :refer [add-user-role user-role]]
            [crypto.password.bcrypt :as crypto]
            [app.util.pg :as db-util]
            [buddy.auth :refer [authenticated?]]
            [validateur.validation :as vl]))

(defentity user
  (table :tbl_user)

  (pk :id)

  (has-one user-role {:fk :user_id}))

(def validation
  (vl/validation-set
   (vl/presence-of :username)
   (vl/presence-of :full_name)
   (vl/presence-of :email)
   (vl/presence-of :password)
   (vl/validate-by :username #(not (db-util/exists? user {:username %})) :message "Username already exist")
   (vl/validate-by :email #(not (db-util/exists? user {:email %})) :message "Email already exist")))

(defn add-user
  "Add user with their role. Default role is :user"
  [user-map & [role]]
  (let [errors (validation user-map)]
    (if (empty? errors)
      (let [password-hash (crypto/encrypt (:password user-map))
            new-user-map (assoc user-map :password password-hash)
            new-user (insert user (values new-user-map))
            user-role (if role role :user)]
        (add-user-role new-user user-role)
        {:success true
         :user new-user})
      {:success false
       :errors errors})))

(defn find-by-username [username]
  (first (select user
                 (with user-role)
                 (where {:username username}))))

(defn get-user-from-request "Create a user map from the request" [request]
  (if (authenticated? request)
    (get-in request [:session :user-info])
    {:authenticated false}))
