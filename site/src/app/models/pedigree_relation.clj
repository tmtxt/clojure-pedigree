(ns app.models.pedigree-relation
  (:require [app.neo4j.main :as neo4j]
            [camel-snake-kebab.core :refer [->snake_case]]
            [app.models.person :as person]))

(defn- link-persons
  "Link two persons entity"
  [parent-entity child-entity rel-type]
  (let [rel-type (->snake_case rel-type)]
    (neo4j/neonode :post "/pedigree/addChildForParent"
                   {:parentId (:id parent-entity)
                    :childId (:id child-entity)
                    :type rel-type
                    :order 0})))

(defn add-child
  "Link a child entity with father and mother entity"
  [father-entity mother-entity child-entity]
  (link-persons father-entity child-entity :father-child)
  (link-persons mother-entity child-entity :mother-child))

(defn add-child-for-mother
  "Link a child entity with mother entity"
  [mother-entity child-entity]
  (link-persons mother-entity child-entity :mother-child))

(defn add-child-for-father
  "Link a child entity with father entity"
  [father-entity child-entity]
  (link-persons father-entity child-entity :father-child))

(defn find-parents
  "Find parents entities of child entity. Return a map with keys :father :mother"
  [child-entity]
  (let [neo-result (->> {:personId (:id child-entity)}
                        (neo4j/neonode :get "/pedigree/findParents")
                        (:data))
        parent-ids (map #(:parent_id %) neo-result)
        parent-entities (person/find-all-by-ids parent-ids)
        map-func (fn [entity]
                   (let [id (:id entity)
                         node (-> #(= (:parent_id %) id)
                                  (filter neo-result)
                                  (first))
                         k (-> (:parent_type node)
                               (clojure.string/replace "_child" "")
                               (keyword))]
                     [k entity]))
        parent-result (into {} (map map-func parent-entities))]
    parent-result))
