(ns app.models.marriageRelation
  (:require [korma.core :refer :all]
            [app.util.dbUtil :as db-util]
            [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.relationships :as nrl]
            [config.neo4j :refer [conn]]
            [validateur.validation :as vl]
            [app.models.person :as person-model]))

(defn add-relation-from-node
  "Add new relation between two node in the system"
  [first-node second-node & {:keys [type]
                             :or [type :husband-wife]}]
  (nrl/create conn first-node second-node type))
