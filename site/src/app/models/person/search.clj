(ns app.models.person.search
  (:require [korma.core :refer [select where]]
            [app.models.person.definition :refer [person]]
            [app.models.person.node
             :refer [find-by-person-id find-root]
             :rename {find-by-person-id find-node-by-person-id
                      find-root find-node-by-root}]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; NOTE
;;; Functions start with "find" are for finding entity, optionally with nodes.
;;; They return a map with key :entity and :node
;;;
;;; Functions start with "find-node" are for finding node.
;;; They return the node directly

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

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Find root
(defn find-node-root
  "Find the root node"
  []
  (find-node-by-root))

(defn find-root
  "Find root entity"
  [& {:keys [include-node]
      :or {include-node false}}]
  (let [node (find-node-root)
        entity (when node
                 (-> (:person-id node) (find-by-id) (:entity)))
        node (when include-node node)]
    {:entity entity
     :node node}))
