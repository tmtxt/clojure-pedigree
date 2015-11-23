(ns app.models.user-role
  (:use [korma.core])
  (:import [org.postgresql.util PGobject])
  (:require [app.util.db-util :as db-util]))

(def USER_ROLE_NAME_USER "user")
(def USER_ROLE_NAME_ADMIN "admin")
(def USER_ROLE_NAMES
  {:user USER_ROLE_NAME_USER
   :admin USER_ROLE_NAME_ADMIN})

(defn prepare-data
  [{role_name :role_name :as name}]
  (if role_name
    (assoc name :role_name (db-util/str->pgobject "user_role_name" role_name))
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

(defn add-user-role [user & [role]]
  (let [role-name (if role role :user)]
    (insert user-role
          (values {:user_id (user :id)
                   :role_name (get USER_ROLE_NAMES role-name USER_ROLE_NAME_USER)}))))
