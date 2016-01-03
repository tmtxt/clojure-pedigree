(ns app.models.marriage-relation
  (:require [app.neo4j.relation :as relation]
            [app.neo4j.main :as neo4j]))

(def RELATION_TYPES
  {:husband-wife :husband_wife
   :wife-husband :wife_husband})

(defn add-marriage
  "Add marriage relation between husband and wife nodes"
  [husband-entity wife-entity & {:keys [husband-order wife-order]
                                 :or {husband-order 0 wife-order 0}}]
  (neo4j/neonode :post "/marriage/addMarriage"
                 {:husbandId (:id husband-entity)
                  :wifeId (:id wife-entity)
                  :husbandOrder husband-order
                  :wifeOrder wife-order}))
