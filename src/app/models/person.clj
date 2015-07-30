(ns app.models.person
  (:require [korma.core :refer :all]
            [korma.db :as kd]
            [app.util.dbUtil :as db-util]
            [app.util.neo4j :as neo-util]
            [app.util.neo4j.command :as ncm]
            [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.labels :as nl]
            [clojurewerkz.neocons.rest.cypher :as cy]
            [clojurewerkz.neocons.rest.transaction :as tx]
            [clojure.tools.logging :as log]
            [config.neo4j :refer [conn]]
            [validateur.validation :as vl]
            [slingshot.slingshot :refer [throw+ try+]]
            [app.models.pedigreeRelation :as prl]
            [app.models.marriageRelation :as mrl]))

(defentity person
  (table :tbl_person)
  (pk :id))

(def pg-validation
  (vl/validation-set
   (vl/presence-of :full_name)))

(def neo4j-validation
  (vl/validation-set
   (vl/presence-of :user_id)
   (vl/validate-by :user_id #(db-util/exists? person {:id %}) :message "User Id not exist")))

(defn add-person-node
  "Add person node into neo4j using the person entity, optionally specify keyword is-root of the system"
  [person-entity & {:keys [is-root]
                    :or {is-root false}}]
  (let [person-node (ncm/create-or-update-node
                     :person
                     {:user_id (person-entity :id)}
                     {:is_root is-root})]
    {:success true
     :person person-entity
     :node person-node}))

(defn add-person
  "Add new person into postgres and neo4j"
  [person-map & {:keys [is-root]
                 :or {is-root false}}]
  (let [errors (pg-validation person-map)]
    (if (empty? errors)
      (let [new-person (insert person (values person-map))]
        (add-person-node new-person :is-root is-root))
      {:success false
       :errors errors})))

(defn find-node-by-user-id
  "Find the node from neo4j using the input user id"
  [user-id]
  (ncm/find-by-props :person {:user_id user-id}))

(defn find-root-node
  "Find the root node from neo4j"
  []
  (let [row (ncm/find-root)
        [root marriage] row]
    (assoc root :marriage marriage)))

(defn find-all-by-ids
  "Find all from postgres where id in ids list"
  [ids]
  (db-util/find-all-by-ids person ids))
