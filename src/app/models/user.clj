(ns app.models.user
  (:use [korma.core])
  (:require [app.models.userRole :refer [create-user-role]]))

;;; Basic Korma model structure
;;; see more at http://sqlkorma.com/docs

(defentity user
  ;; Basic configuration

  ;; Table, by default the name of the entity
  (table :tbl_user)

  ;; Primary key, by default "id"
  ;; This line is unnecessary, it's used for relationships joins.
  (pk :id)

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

(defn create-init-users []
  (let [count-list (select user (aggregate (count :*) :cnt))
        count (:cnt (first count-list))]
    ;; create new admin account when no user exists in the system
    (when (zero? count)
      (let [admin (insert user
                          (values {:full_name "Admin"
                                   :email "admin@example.com"
                                   :password "hello"}))]
        ;; (create-user-role admin :admin)
        ))))
