(ns config.neo4j
  (:require [korma.db]
            [korma.core]
            [environ.core :refer [env]]))

(def neonode-host (env :neonode-host))
(def neonode-port (env :neonode-port))
