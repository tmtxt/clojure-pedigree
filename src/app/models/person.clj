(ns app.models.person
  (:require [korma.core :refer :all]
            [app.util.dbUtil :as db-util]))

(defentity person
  ;; Table, by default the name of the entity
  (table :tbl_person)

  (pk :id))

(defn create-init-person []
  (when (db-util/table-empty? person)
    (let [root (insert person
                       (values {:full_name "Root Person"}))]
      root)))
