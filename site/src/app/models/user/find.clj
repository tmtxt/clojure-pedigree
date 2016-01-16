(ns app.models.user.find
  (:require [korma.core :refer [select with where]]
            [app.models.user.definition :refer [user]]
            [app.models.user-role :refer [user-role]]
            [slingshot.slingshot :refer [throw+ try+]]))

(defn find-by-username
  "Find user entity by username"
  [username]
  (-> user
      (select
       (with user-role)
       (where {:username username}))
      first))
