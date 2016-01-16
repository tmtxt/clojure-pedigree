(ns app.models.user.validation
  (:require [validateur.validation :refer [validation-set presence-of validate-by valid?]]
            [app.models.user.definition :refer [user]]
            [app.util.pg :as db-util]))

(defn- exists-fn [key]
  #(not (db-util/exists? user {key %})))

(def ^:private validation
  (validation-set
   (presence-of :username :message "Tên đăng nhập không được để trống")
   (presence-of :full-name :message "Tên không được để trống")
   (presence-of :email :message "Email không được để trống")
   (presence-of :password :message "Mật khẩu không được để trống")
   (validate-by :username (exists-fn :username) :message "Tên đăng nhập này đã tồn tại")
   (validate-by :email (exists-fn :email) :message "Email này đã tồn tại")))

(defn validate-user
  "Validate the input user entity"
  [entity]
  (validation entity))
