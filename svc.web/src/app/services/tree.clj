(ns app.services.tree
  (:require [app.services.util :refer [call-json]]))

(defn get-tree [root-id depth]
  (call-json :svc-api-tree "/get/tree" :get {:root-node-id root-id
                                             :depth  depth}))
