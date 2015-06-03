(ns app.models.pedigreeRelation
  (:require [korma.core :refer :all]
            [app.util.dbUtil :as db-util]
            [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.relationships :as nrl]
            [config.neo4j :refer [conn]]
            [validateur.validation :as vl]))

(defn add-relation-from-node
  "Add new relation between two node in the system"
  [parent-node child-node & {:keys [type]
                             :or [type :father-child]}]
  (nrl/create conn parent-node child-node type))
