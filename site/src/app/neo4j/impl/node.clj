(ns app.neo4j.impl.node
  (:require [app.neo4j.impl.statement :as stm]
            [app.neo4j.query :as query]
            [clojurewerkz.neocons.rest.transaction :as tx]))

(defn create-or-update-node-statement
  "Create the neocon statement object for create-or-update-node-statement.
  Will produce the query like this
  MERGE (n:person {user_id: {identifier}.user_id})
  ON CREATE SET n.age = {props}.age, n.name = {props}.name
  ON MATCH SET n.age = {props}.age, n.name = {props}.name
  RETURN n"
  [label identifier props]
  (let [_label (stm/get-label label)
        _update_string (stm/map-props-to-update-string props "n" "props")
        _identifier_string (stm/map-props-to-string identifier "identifier")
        _match_string (str " ON CREATE SET " _update_string
                           " ON MATCH SET " _update_string)]
    (tx/statement (format "MERGE (n:%s {%s}) %s RETURN n, id(n)"
                          _label
                          _identifier_string
                          _match_string)
                  {:identifier identifier
                   :props props})))

(defn find-by-props-statement
  "Create the neocon statement object for finding nodes by props"
  [label props]
  (let [_label (stm/get-label label)
        statement (format query/find-by-props
                          _label
                          (stm/map-props-to-string props "props"))]
    (tx/statement statement {:props props})))
