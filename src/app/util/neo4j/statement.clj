(ns app.util.neo4j.statement
  (:require [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.transaction :as tx]
            [clojurewerkz.neocons.rest.cypher :as cy]))

(def ^:dynamic *tran*)
(def ^:dynamic *conn*)

(defn get-label [label] (if (keyword? label) (name label) label))

(defn map-props-to-string [props param-name]
  (clojure.string/join
   ", "
   (map (fn [[key val]]
          (str (name key) ": " "{" param-name "}." (name key)))
        props)))

;;; (create-node :person {:name "hello" :age 18})
(defn create-node-statement
  "Construct the create node cypher statement.
  The statement returns the inserted node.
  The function returns the statement string.
  Input value is a props map and the label (keyword or string)"
  [label props]
  (let [_label (get-label label)]
    (tx/statement (format "CREATE (n:`%s` {props}) RETURN n" _label)
                  {:props props})))

;;; (create-merge-node :person {:user_id 5})
(defn create-merge-node-statement
  "Create node using Merge"
  [label props]
  (let [_label (get-label label)]
    (tx/statement (format "MERGE (n:%s {%s}) RETURN n"
                          _label
                          (map-props-to-string props "props"))
                  {:props props})))

;;; (create-or-update-node :person {:user_id 5})
;;; (create-or-update-node :person {:user_id 5} {:age 18 :name "hello"})
(defn create-or-update-node-statement
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
  ([label identifier] (create-or-update-node-statement label identifier {}))
  ([label identifier props]
   (let [_label (get-label label)
         _update_string (clojure.string/join
                         ", "
                         (map (fn [[key val]] (str "n." (name key) " = {props}." (name key))) props))]
     (tx/statement (format "MERGE (n:%s {%s}) %s RETURN n, id(n)"
                           _label
                           (map-props-to-string identifier "identifier")
                           (if (empty? props)
                             ""
                             (str " ON CREATE SET " _update_string
                                  " ON MATCH SET " _update_string)))
                   {:identifier identifier
                    :props props}))))

(defn create-or-update-node
  "Create or update node with connection and transaction.
  See the create-or-update-node-statement function for more info"
  ;; ([conn transaction label identifier]
  ;;  (create-or-update-node conn transaction label identifier {}))
  ([label identifier props]
   (let [statement (create-or-update-node-statement label identifier props)
         [_ result] (tx/execute *conn* *tran* [statement])
         [response] result
         row (-> response :data first :row)
         [data id] row]
     (assoc data :id id))))

;;; wrap the util function inside transaction
(defmacro with-transaction
  [connection & body]
  (let [transaction (gensym "transaction")]
    `(let [~transaction (clojurewerkz.neocons.rest.transaction/begin-tx ~connection)]
       (binding [app.util.neo4j.statement/*conn* ~connection]
         (binding [app.util.neo4j.statement/*tran* ~transaction]
           (clojurewerkz.neocons.rest.transaction/with-transaction ~connection ~transaction true
             ~@body))))))
