(ns app.models.pedigreeRelation
  (:require [korma.core :refer :all]
            [app.util.dbUtil :as db-util]
            [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.relationships :as nrl]
            [config.neo4j :refer [conn]]
            [validateur.validation :as vl]))

(def RELATION_TYPES
  {:father-child :father_child
   :mother-child :mother_child})

(defn add-relation-from-node
  "Add new relation between two node in the system"
  [parent-node child-node & {:keys [type]
                             :or [type (:father-child RELATION_TYPES)]}]
  (nrl/create conn parent-node child-node type))

(defn add-child
  "Add child for the given parents node"
  [father-node mother-node child-node]
  (add-relation-from-node father-node child-node :type (:father-child RELATION_TYPES))
  (add-relation-from-node mother-node child-node :type (:mother-child RELATION_TYPES)))
