(ns app.models.pedigree-relation
  (:require [app.neo4j.main :as neo4j]
            [app.neo4j.relation :as relation]))

(def RELATION_TYPES
  {:father-child :father_child
   :mother-child :mother_child})

(defn add-relation-from-node
  "Add new relation between two node in the system"
  [parent-entity child-entity order & {:keys [type]
                                       :or [type (:father-child RELATION_TYPES)]}]
  (neo4j/neonode :post "/pedigree/addChildForParent"
                 {:parentId (:id parent-entity)
                  :childId (:id child-entity)
                  :type type
                  :order order}))

(defn add-child
  "Add child for the given parents node"
  [father-entity mother-entity child-entity & [order]]
  (let [_order (if order order 0)]
    (add-relation-from-node father-entity child-entity _order
                            :type (:father-child RELATION_TYPES))
    (add-relation-from-node mother-entity child-entity _order
                            :type (:mother-child RELATION_TYPES))))

(defn add-child-for-mother [mother-entity child-entity & [order]]
  (let [_order (if order order 0)]
    (add-relation-from-node mother-entity child-entity _order
                            :type (:mother-child RELATION_TYPES))))

(defn add-child-for-father [father-entity child-entity & [order]]
  (let [_order (if order order 0)]
    (add-relation-from-node father-entity child-entity _order
                            :type (:father-child RELATION_TYPES))))
