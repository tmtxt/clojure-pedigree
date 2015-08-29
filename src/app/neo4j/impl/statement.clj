(ns app.neo4j.impl.statement
  (:require [clojurewerkz.neocons.rest.transaction :as tx]))

(defn raw-query
  "Create the neocons statement object using the input raw query"
  [query & args]
  (let [statement (apply format query args)]
    (tx/statement statement)))
