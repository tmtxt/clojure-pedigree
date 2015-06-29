(ns app.util.neo4j.query
  (:require [clojure.java.io :as io]))

(def query-path "resources/query/")

(defn read-query [file]
  (slurp (str query-path file ".cyp")))

(def get-tree (read-query "get_tree"))
