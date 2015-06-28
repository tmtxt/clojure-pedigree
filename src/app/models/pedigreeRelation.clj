(ns app.models.pedigreeRelation
  (:require [korma.core :refer :all]
            [app.util.dbUtil :as db-util]
            [app.util.neo4j.command :as ncm]
            [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.relationships :as nrl]
            [config.neo4j :refer [conn]]
            [validateur.validation :as vl]))

(def RELATION_TYPES
  {:father-child :father_child
   :mother-child :mother_child})

(defn add-relation-from-node
  "Add new relation between two node in the system"
  [parent-node child-node order & {:keys [type]
                                   :or [type (:father-child RELATION_TYPES)]}]
  (ncm/create-or-update-relation :person parent-node
                                 :person child-node
                                 type {:order order})
  )

(defn add-child
  "Add child for the given parents node"
  [father-node mother-node child-node & [order]]
  (let [_order (if order order 0)]
    (add-relation-from-node father-node child-node _order
                            :type (:father-child RELATION_TYPES))
    (add-relation-from-node mother-node child-node _order
                            :type (:mother-child RELATION_TYPES))))
