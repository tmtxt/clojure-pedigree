(ns app.models.pedigree-relation
  (:require [app.neo4j.relation :as relation]))

(def RELATION_TYPES
  {:father-child :father_child
   :mother-child :mother_child})

(defn add-relation-from-node
  "Add new relation between two node in the system"
  [parent-node child-node order & {:keys [type]
                                   :or [type (:father-child RELATION_TYPES)]}]
  (relation/create-or-update :person parent-node
                                 :person child-node
                                 type {:order order})
  )

(defn add-child
  "Add child for the given parents node"
  [father-node mother-node child-node & [order]]
  (let [_order (if order order 0)]
    (add-relation-from-node father-node child-node _order
                            :type (:father-child RELATION_TYPES))
    (add-relation-from-node mother-node child-node _order
                            :type (:mother-child RELATION_TYPES))))

(defn add-child-for-mother [mother-node child-node & [order]]
  (let [_order (if order order 0)]
    (add-relation-from-node mother-node child-node _order
                            :type (:mother-child RELATION_TYPES))))

(defn add-child-for-father [father-node child-node & [order]]
  (let [_order (if order order 0)]
    (add-relation-from-node father-node child-node _order
                            :type (:father-child RELATION_TYPES))))
