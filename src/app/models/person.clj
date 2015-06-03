(ns app.models.person
  (:require [korma.core :refer :all]
            [app.util.dbUtil :as db-util]
            [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.labels :as nl]
            [config.neo4j :refer [conn]]
            [validateur.validation :as vl]))

(defentity person
  (table :tbl_person)

  (pk :id))

(def pg-validation
  (vl/validation-set
   (vl/presence-of :full_name)))

(def neo4j_validation
  (vl/validation-set
   (vl/presence-of :user_id)
   (vl/validate-by :user_id #(db-util/exists? person {:id %}) :message "User Id not exist")))

(defn add-person
  "Add new person into postgres and neo4j"
  [person-map & {:keys [is-root]
                 :or {is-root false}}]
  (let [errors (pg-validation person-map)]
    (if (empty? errors)
      (let [new-person (insert person (values person-map))]
        (add-person-node new-person :is-root is-root))
      {:success false
       :errors errors})
    ))

(defn add-person-node
  "Add person node into neo4j using the person entity, optionally specify keyword is-root of the system"
  [person-entity & {:keys [is-root]
                    :or {is-root false}}]
  (let [person-node (nn/create conn {:user_id (person-entity :id)
                                     :is_root is-root})]
    (nl/add conn person-node "person")
    {:success true
     :person person-entity
     :node person-node})
  )

(defn create-init-person []
  (when (db-util/table-empty? person)
    (let [root (insert person
                       (values {:full_name "Root Person"}))
          root-node (nn/create conn {:user_id (root :id)
                                     :is_root true})]
      (nl/add conn root-node "person")
      root)))











