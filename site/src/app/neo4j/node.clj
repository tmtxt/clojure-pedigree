(ns app.neo4j.node
  (:require [app.neo4j.main :as neo4j]
            [app.neo4j.impl.node :as node]
            [clojurewerkz.neocons.rest.transaction :as tx]))

(defn create-or-update
  "Find the node with the input label and identifier. If not exist, create the node.
  Otherwise, update the node with the input props map.
  (create-or-update-node :person {:user_id 5} {:age 18 :name \"hello\"})"
  ([label identifier props]
   (let [statement (node/create-or-update-node-statement label identifier props)
         [_ result] (tx/execute neo4j/*conn* neo4j/*tran* [statement])
         [response] result
         row (-> response :data first :row)
         [data id] row]
     data)))

(defn find-by-props
  "Find node by label and props maps"
  [label props]
  (let [statement (node/find-by-props-statement label props)
        [_ result] (tx/execute neo4j/*conn* neo4j/*tran* [statement])
        response (first result)
        data (-> response :data first :row first)]
    data))
