(ns app.models.person.parent
  (:require [app.neo4j.main :as neo4j]
            [app.neo4j.query :as query]))

(defn count-parents [entity]
  (let [[result] (neo4j/execute-statement query/count-parent (:id entity))
        data (:data result)
        count (-> data first :row first)]
    count))

(defn enough-parents? [entity]
  (= (count-parents entity) 2))
