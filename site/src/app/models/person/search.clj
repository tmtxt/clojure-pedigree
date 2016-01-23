(ns app.models.person.search
  (:require [korma.core :refer [select where]]
            [app.models.person.definition :refer [person]]
            [app.models.person.node
             :refer [find-by-person-id]
             :rename {find-by-person-id find-node-by-person-id}]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; By person id
(defn find-by-id
  "Find person entity by id"
  [id & {:keys [include-node]
         :or {include-node false}}]
  (let [entity (->> (where {:id id}) (select person) (first))
        node (when include-node (find-node-by-person-id id))]
    {:entity entity
     :node node}))

(defn find-node-by-id
  "Find node by person id"
  [id]
  (find-node-by-person-id id))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; By full name
(defn find-by-full-name
  "Find first matching person by comparing full-name using LIKE expression"
  [full-name & {:keys [include-node]
                :or {include-node false}}]
  (let [full-name (str "%" full-name "%")
        entity (->> (where {:full_name [like full-name]})
                    (select person)
                    (first))
        node (when (and entity include-node)
               (find-node-by-person-id (:id entity)))]
    {:entity entity
     :node node}))
