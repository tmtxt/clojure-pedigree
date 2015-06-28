(ns app.util.neo4j.statement
  (:require [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.transaction :as tx]
            [clojurewerkz.neocons.rest.cypher :as cy]))

(defn get-label [label] (if (keyword? label) (name label) label))

(defn map-props-to-string
  "Create the props string from the input props map and param-name
  props: {:user_id 1 :age 10} param-name: props-name
  return
  user_id: {props-name}.user_id, age: {props-name}.age"
  [props param-name]
  (clojure.string/join
   ", "
   (map (fn [[key val]]
          (str (name key) ": " "{" param-name "}." (name key)))
        props)))

(defn map-props-to-update-string
  "Create the props string used for update command (SET)
  props: {:user_id 1 :age 10} param-name: props-name
  return
  n.user_id = {props-name}.user_id, n.age = {props-name}.age"
  [props node-name param-name]
  (clojure.string/join
   ", "
   (map (fn [[key val]] (str node-name "." (name key) " = {" param-name "}." (name key))) props)))

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
         _update_string (map-props-to-update-string props "n" "props")]
     (tx/statement (format "MERGE (n:%s {%s}) %s RETURN n, id(n)"
                           _label
                           (map-props-to-string identifier "identifier")
                           (if (empty? props)
                             ""
                             (str " ON CREATE SET " _update_string
                                  " ON MATCH SET " _update_string)))
                   {:identifier identifier
                    :props props}))))

(defn create-or-update-relation
  "Create or update relation between two nodes.
  Find the relation between the start and end nodes using the identifier
  of the two. After that, find the relationship between them with the input
  label. If not found, create new, otherwise, update with the props.

  When optional props is passed, produce the statement like this
  MATCH (a:person {user_id: {start}.user_id}), (b:person {user_id: {end}.user_id})
  CREATE UNIQUE a-[r:father_child]->b
  SET r.order = {props}.order
  RETURN r"
  [start-label start-identifier
   end-label end-identifier
   label & [props]]
  (let [_start-label (get-label start-label)
        _end-label (get-label end-label)
        _label (get-label label)
        _update_string (map-props-to-update-string props "r" "props")
        statement (format
                   "MATCH (a:%s {%s}), (b:%s {%s}) CREATE UNIQUE a-[r:%s]->b %s RETURN r"
                   _start-label
                   (map-props-to-string start-identifier "start")
                   _end-label
                   (map-props-to-string end-identifier "end")
                   _label
                   (if (empty? props)
                     ""
                     (str "SET " _update_string)))]
    (tx/statement statement {:start start-identifier
                             :end end-identifier
                             :props props})))
