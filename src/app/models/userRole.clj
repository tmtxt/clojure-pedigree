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

  (prepare prepare-data)
  ;; Default fields for selects
  ;; (entity-fields :column1 :column2)

  ;; Relationships, uncomment or add more as necessary

  ;; assumes users.id = address.users_id
  ;; (has-one address)

  ;; assumes users.id = email.users_id
  ;; but gets the results in a second query
  ;; for each element
  ;; (has-many email)

  ;; assumes users.account_id = account.id
  ;; (belongs-to account)

  ;; assumes a table users_posts with columns users_id
  ;; and posts_id
  ;; like has-many, also gets the results in a second
  ;; query for each element
  ;; (many-to-many posts :users_posts)
  )

(defn create-user-role [user role]
  (insert user-role
          (values {:user_id (user :id)
                   :role_name "admin"})))



