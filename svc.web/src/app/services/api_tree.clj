(ns app.services.api-tree
  (:require [app.services.util :refer [call-json]]))

(defn get-tree [root-node-id depth]
  (call-json :svc-api-tree "/get/tree" :get {:root-node-id root-node-id
                                             :depth  depth}))
