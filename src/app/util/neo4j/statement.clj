(ns app.util.neo4j.statement
  (:require [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.transaction :as tx]))

(defn get-label [label] (if (keyword? label) (name label) label))

(defn map-props-to-string [props param-name]
  (clojure.string/join
   ", "
   (map (fn [[key val]]
          (str (name key) ": " "{" param-name "}." (name key)))
        props)))

;;; (create-node :person {:name "hello" :age 18})
(defn create-node
  "Construct the create node cypher statement.
  The statement returns the inserted node.
  The function returns the statement string.
  Input value is a props map and the label (keyword or string)"
  [label props]
  (let [_label (get-label label)]
    (tx/statement (format "CREATE (n:`%s` {props}) RETURN n" _label)
                  {:props props})))

(defn create-merge-node
  "Create node using Merge"
  [label props]
  (let [_label (get-label label)]
    (tx/statement (format "MERGE (n:%s {%s}) RETURN n"
                          _label
                          (map-props-to-string props "props"))
                  {:props props})))
