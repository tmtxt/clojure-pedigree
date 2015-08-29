(ns app.neo4j.query
  (:require [clojure.java.io :as io]))

;;; Helper functions
(def ^{:private true} query-path
  "The place where the Neo4j query files reside"
  "resources/query/")

(defn- read-query
  "Read the query file inside the query-path directory.
  The file-name should exclude the extension (.cyp)"
  [file-name]
  (slurp (str query-path file-name ".cyp")))

;;; Query strings
(def get-tree (read-query "get_tree"))
(def find-root (read-query "find_root"))
(def find-by-props (read-query "find_by_props"))
(def find-partner (read-query "find_partner"))
