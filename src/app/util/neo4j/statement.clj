(ns app.util.neo4j.statement
  (:require [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.transaction :as tx]))

;;; (create-node :person {:name "hello" :age 18})
(defn create-node
  "Construct the create node cypher statement.
  The statement returns the inserted node.
  The function returns the statement string.
  Input value is a props map and the label (keyword or string)"
  [label props]
  (let [_label (if (keyword? label) (name label) label)]
    (tx/statement (format "CREATE (n:`%s` {props}) RETURN n" _label)
                  {:props props})))
