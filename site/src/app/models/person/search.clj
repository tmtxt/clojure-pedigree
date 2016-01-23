(ns app.models.person.search
  (:require [korma.core :refer [select where]]
            [app.models.person.definition :refer [person]]
            [app.models.person.node
             :refer [find-by-person-id]
             :rename {find-by-person-id find-node-by-person-id}]))

(defn find-by-id
  "Find person eneity by id"
  [id & {:keys [include-node]
         :or {include-node false}}]
  (let [entity (->> (where {:id id}) (select person) (first))
        node (when include-node (find-node-by-person-id id))]
    {:entity entity
     :node node}))
