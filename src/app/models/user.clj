(ns app.models.user
  (:use [korma.core])
  (:require [app.models.userRole :refer [create-user-role]]
            [crypto.password.bcrypt :as crypto]
            [app.util.dbUtil :as db-util]))

;;; Basic Korma model structure
;;; see more at http://sqlkorma.com/docs

(defentity user
  (table :tbl_user)

  (pk :id)
  )

(defn create-init-users []
  (when (db-util/table-empty? user)
    (let [admin (insert user
                          (values {:full_name "Admin"
                                   :email "admin@example.com"
                                   :password (crypto/encrypt "admin")}))]
        (create-user-role admin :admin))))
