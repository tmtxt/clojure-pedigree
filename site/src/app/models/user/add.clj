(ns app.models.user.add
  (:require [korma.core :refer [insert values]]
            [app.models.user.definition :refer [user]]
            [app.models.user-role :refer [add-user-role]]
            [slingshot.slingshot :refer [throw+ try+]]))

(defn add-user
  "Add user with their role. Default role is :user"
  [entity & {:keys [role]
             :or {role :user}}]
  (try+
   (let [new-user (insert user (values entity))
         _ (when (nil? new-user) (throw+ "Cannot insert new user"))
         _ (add-user-role new-user role)]
     {:success true
      :entity new-user})
   (catch Object res {:success false
                      :message res})))
