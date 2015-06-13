(ns app.util.neo4j
  (:require [config.neo4j :refer [conn]]
            [clojurewerkz.neocons.rest.nodes :as nn]))

(def INDEX_NAMES
  "Name of all indexes created in the database"
  {:user-id "user_id"})

(defn create-indexes
  "Create necessary index for Neo4j database"
  []
  (nn/create-index conn (:user-id INDEX_NAMES)))
