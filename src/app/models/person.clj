(ns app.models.person
  (:require [korma.core :refer :all]
            [app.util.dbUtil :as db-util]
            [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.labels :as nl]
            [config.neo4j :refer [conn]]))

(defentity person
  ;; Table, by default the name of the entity
  (table :tbl_person)

  (pk :id))

(defn create-init-person []
  (when (db-util/table-empty? person)
    (let [root (insert person
                       (values {:full_name "Root Person"}))
          root-node (nn/create conn {:user_id (root :id)
                                     :is_root true})]
      (nl/add conn root-node "person")
      root)))
