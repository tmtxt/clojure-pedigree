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

;;; (create-merge-node :person {:user_id 5})
(defn create-merge-node
  "Create node using Merge"
  [label props]
  (let [_label (get-label label)]
    (tx/statement (format "MERGE (n:%s {%s}) RETURN n"
                          _label
                          (map-props-to-string props "props"))
                  {:props props})))

;;; (create-or-update-node :person {:user_id 5})
;;; (create-or-update-node :person {:user_id 5} {:age 18 :name "hello"})
(defn create-or-update-node
  "Create node or update.
  Search the database using the identifier map and then optionally
  update or set the props in props map if found or create.

  When the optional props is passed, will produce the statement like this
  MERGE (n:person {user_id: {identifier}.user_id})
  ON CREATE SET n.age = {props}.age, n.name = {props}.name
  ON MATCH SET n.age = {props}.age, n.name = {props}.name
  RETURN n

  When the optional props is not passed, will product the statement like this
  MERGE (n:person {user_id: {identifier}.user_id})
  RETURN n
  "
  ([label identifier] (create-or-update-node label identifier {}))
  ([label identifier props]
   (let [_label (get-label label)
         _update_string (clojure.string/join
                         ", "
                         (map (fn [[key val]] (str "n." (name key) " = {props}." (name key))) props))]
     (tx/statement (format "MERGE (n:%s {%s}) %s RETURN n"
                           _label
                           (map-props-to-string identifier "identifier")
                           (if (empty? props)
                             ""
                             (str " ON CREATE SET " _update_string
                                  " ON MATCH SET " _update_string)))
                   {:identifier identifier
                    :props props}))))
