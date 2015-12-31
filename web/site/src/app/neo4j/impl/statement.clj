(ns app.neo4j.impl.statement
  (:require [clojurewerkz.neocons.rest.transaction :as tx]))

(defn raw-query
  "Create the neocons statement object using the input raw query"
  [query & args]
  (let [statement (apply format query args)]
    (tx/statement statement)))

(defn get-label
  "Convert the label(string/keyword) to standard one"
  [label]
  (if (keyword? label)
    (name label)
    label))

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
