(ns app.models.user.definition
  (:require [korma.core :refer [defentity has-one pk table transform prepare]]
            [app.models.user-role :refer [user-role]]
            [app.util.model :refer [entity->record record->entity]]
            [app.models.user.password :refer [hash-password-for-entity]]))

(defrecord UserEntity
    [id full-name email password username language created-at])

(defn- transform-data [data]
  (entity->record data map->UserEntity))

(defn- prepare-data [data]
  (-> data hash-password-for-entity record->entity))

(defentity user
  (table :tbl_user)
  (pk :id)
  (transform transform-data)
  (prepare prepare-data)
  (has-one user-role {:fk :user_id}))
