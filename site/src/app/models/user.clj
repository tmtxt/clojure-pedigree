(ns app.models.user
  (:use [korma.core])
  (:require [app.models.user-role :refer [add-user-role user-role]]
            [crypto.password.bcrypt :as crypto]
            [app.util.pg :as db-util]
            [environ.core :refer [env]]
            [buddy.auth :refer [authenticated?]]
            [validateur.validation :as vl]
            [app.models.user.definition :as definition]))

(def user definition/user)

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

(defn change-password [user-id password]
  (let [user-data (first (select user (where {:id user-id})))]
    (if user-data
      (let [password-hash (crypto/encrypt password)
            result (update user (set-fields {:password password-hash}) (where {:id user-id}))]
        (clojure.pprint/pprint result))
      false)))

(defn get-user-from-request "Create a user map from the request" [request]
  ;; (cond
  ;;   (-> :profile env (= "dev"))
  ;;   {:authenticated true
  ;;    :username "dev"
  ;;    :role "admin"
  ;;    :locale "vi"}
  ;;   (authenticated? request)
  ;;   (get-in request [:session :user-info])
  ;;   :else {:authenticated false})
  (clojure.pprint/pprint (if (authenticated? request) (get-in request [:session :user-info]) {:authenticated false}))
  (if (authenticated? request) (get-in request [:session :user-info]) {:authenticated false})

  )
