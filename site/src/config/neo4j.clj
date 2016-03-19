(ns config.neo4j
  (:require [korma.db]
            [korma.core]
            [environ.core :refer [env]]))

(def neonode-host (env :NEONODE_HOST))
(def neonode-port (env :NEONODE_PORT))
