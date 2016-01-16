(ns app.models.user
  (:use [korma.core])
  (:require [app.models.user-role :refer [add-user-role user-role]]
            [crypto.password.bcrypt :as crypto]
            [app.util.pg :as db-util]
            [environ.core :refer [env]]
            [buddy.auth :refer [authenticated?]]
            [validateur.validation :as vl]

            [app.models.user.definition :as definition]
            [app.models.user.validation :as validation]
            [app.models.user.add :as add]
            [app.models.user.find :as find]
            [app.models.user.update :as upd]
            [app.models.user.password :as password]))

;;; Entity
(def user definition/user)

(def validate-user validation/validate-user)

(def add-user add/add-user)

(def find-by-username find/find-by-username)

(def change-password upd/update-password)

(def correct-password? password/correct-password?)

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
  (if (authenticated? request) (get-in request [:session :user-info]) {:authenticated false})

  )
