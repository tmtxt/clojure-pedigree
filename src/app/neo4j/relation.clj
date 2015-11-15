(ns app.neo4j.relation
  (:require [app.neo4j.main :as neo4j]
            [app.neo4j.impl.relation :as relation]
            [camel-snake-kebab.core :refer :all]
            [camel-snake-kebab.extras :refer [transform-keys]]
            [clojurewerkz.neocons.rest.transaction :as tx]))

(defn create-or-update
  "Find the relation, if not exist, create the relation, otherwise, update with the props map.
  start-label:      label of starting node in the relation
  start-identifier: identifier props of starting node
  end-label:        label of end node in the relation
  end-identifier:   identifier props of end node
  label:            label of relation
  props:            props map of relation
  "
  [start-label start-identifier
   end-label end-identifier
   label props]
  (let [start-identifier (transform-keys ->snake_case start-identifier)
        end-identifier (transform-keys ->snake_case end-identifier)
        statement (relation/create-or-update-statement start-label start-identifier
                                                       end-label end-identifier
                                                       label props)
        [_ result] (tx/execute neo4j/*conn* neo4j/*tran* [statement])]
    result))
