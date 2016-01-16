(ns app.models.user.password
  (:require [crypto.password.bcrypt :as crypto]))

(defn hash-password
  "Hash the input password"
  [password]
  (crypto/encrypt password))

(defn hash-password-for-entity
  "Hash password for the entity, return the new entity with the :password hashed if exists"
  [entity]
  (let [password (:password entity)]
    (if (-> password nil? not)
      (assoc entity :password (hash-password password))
      entity)))

(defn correct-password?
  "Check if the user entity has correct password"
  [entity password]
  (crypto/check password (:password entity)))
