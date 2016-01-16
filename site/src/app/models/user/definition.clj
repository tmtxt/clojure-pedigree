(ns app.models.user.definition
  (:require [korma.core :refer [defentity has-one pk table transform]]
            [app.models.user-role :refer [user-role]]
            [app.util.model :refer [entity-to-record]]))

(defrecord UserEntity
    [id full-name email password username language created-at])

(defn- transform-data [data]
  (entity-to-record data map->UserEntity))

(defentity user
  (table :tbl_user)
  (pk :id)
  (transform transform-data)
  (has-one user-role {:fk :user_id}))
