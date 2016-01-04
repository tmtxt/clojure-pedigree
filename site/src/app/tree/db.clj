(ns app.tree.db
  (:require [app.models.person :as person]
            [app.neo4j.main :as neo4j]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn find-root [person-id]
  (try+
   (when (nil? person-id) (throw+ "find-root"))
   (let [root (person/find-person-by {:id person-id}
                                     :include-node true
                                     :include-partners true
                                     :json-friendly true)
         entity (:entity root)]
     (when (empty? entity) (throw+ "find-root"))
     root)
   (catch Object _ (person/find-root :include-node true
                                     :include-partners true
                                     :json-friendly true))))

(defn query-tree
  "Query tree using Neo4j"
  [root-id depth]
  (->> {:rootId root-id :depth depth}
       (neo4j/neonode :get "/tree/get")
       :data))
