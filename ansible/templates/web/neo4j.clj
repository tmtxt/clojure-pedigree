;;; GENERATED BY ANSIBLE. DO NOT EDIT
;;; EDIT TEMPLATE IN ansible/templates/neo4j.clj
(ns config.neo4j
  (:require [clojurewerkz.neocons.rest :as nr]))

;; connects to a Neo4J Server with default username neo4j and password
(def conn (nr/connect "http://{{ web_neo4j_host }}:{{ web_neo4j_port }}/db/data"))

(def neonode-host {{ neo_node_host | to_json }})
(def neonode-port {{ neo_node_port | to_json }})
