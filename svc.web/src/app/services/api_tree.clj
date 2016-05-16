(ns app.services.api-tree
  (:require [app.services.util :refer [call-json]]))

(defn get-tree [person-id depth]
  (call-json :svc-api-tree "/get/tree" :get {:person-id person-id
                                             :depth  depth}))
