(ns app.models.person
    (:use [korma.core]))

(defentity person
  ;; Table, by default the name of the entity
  (table :tbl_person)

  (pk :id))
