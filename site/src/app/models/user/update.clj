(ns app.models.user.update
  (:require [korma.core :refer [update set-fields where] :rename {update upd}]
            [app.models.user.definition :refer [user]]
            [app.models.user.password :refer [hash-password]]))

(defn update-password
  "Update password of an entity"
  [entity password]
  (upd user (set-fields {:password password})
       (where {:id (:id entity)})))
