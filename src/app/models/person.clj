(ns app.models.person
    (:use [korma.core]))

(defentity person
  ;; Table, by default the name of the entity
  (table :tbl_person)

  (pk :id))

(defn create-init-person []
  (let [count-list (select person (aggregate (count :*) :cnt))
        count (->> count-list (first) (:cnt))]
    (println count)))
