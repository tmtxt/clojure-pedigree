(ns app.models.pedigreeRelation
  (:require [korma.core :refer :all]
            [app.util.dbUtil :as db-util]
            [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.relationships :as nrl]
            [config.neo4j :refer [conn]]
            [validateur.validation :as vl]
            [app.models.person :as person-model]))

(defn add-relation-from-node
  "Add new relation between two node in the system"
  [parent-node child-node & {:keys [type]
                             :or [type :father-child]}]
  (println parent-node)
  (println child-node)
  (println type)
  (nrl/create conn parent-node child-node type))

(defn test []
  (let [p1 (person-model/add-person {:full_name "P1"})
        p2 (person-model/add-person {:full_name "P2"})
        n1 (p1 :node)
        n2 (p2 :node)]
    (add-relation-from-node n1 n2)
    ))
