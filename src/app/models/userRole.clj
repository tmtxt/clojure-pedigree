(ns app.models.userRole
  (:use [korma.core])
  (:import [org.postgresql.util PGobject]))

;;; Basic Korma model structure
;;; see more at http://sqlkorma.com/docs

(def USER_ROLE_NAMES
  {:user "user"
   :admin "admin"})

(defn str->pgobject
  [type value]
  (doto (PGobject.)
    (.setType type)
    (.setValue value)))

(defn prepare-data
  [{role_name :role_name :as name}]
  (if role_name
    (assoc name :role_name (str->pgobject "user_role_name" role_name))
    name))

(defentity user-role
  ;; Basic configuration

  ;; Table, by default the name of the entity
  (table :tbl_user_role)

  ;; Primary key, by default "id"
  ;; This line is unnecessary, it's used for relationships joins.
  (pk :id)

  ;; transform data before inserting into the database
  (prepare prepare-data))

(defn create-user-role [user role]
  (insert user-role
          (values {:user_id (user :id)
                   :role_name (get USER_ROLE_NAMES role "user")})))
