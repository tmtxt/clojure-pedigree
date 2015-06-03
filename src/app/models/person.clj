(ns app.models.person
  (:require [korma.core :refer :all]
            [app.util.dbUtil :as db-util]
            [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.labels :as nl]
            [config.neo4j :refer [conn]]
            [validateur.validation :as vl]))

(defentity person
  ;; Table, by default the name of the entity
  (table :tbl_person)

  (pk :id))

(def pg-validation
  (vl/validation-set
   (vl/presence-of :full_name)))

(defn add-person [person-map]
  (let [errors (pg-validation person-map)]
    (if (empty? errors)
      (let [new-person (insert person (values person-map))]
        {:success true
         :person new-person})
      {:success false
       :errors errors})
    ))

(defn create-init-person []
  (when (db-util/table-empty? person)
    (let [root (insert person
                       (values {:full_name "Root Person"}))
          root-node (nn/create conn {:user_id (root :id)
                                     :is_root true})]
      (nl/add conn root-node "person")
      root)))










