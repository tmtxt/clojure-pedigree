(ns app.models.marriage-relation
  (:require [app.neo4j.main :as neo4j]
            [app.models.person :as person]))

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
(defn find-partners
  "Find all partners of entity"
  [entity]
  (let [neo-result (->> {:personId (:id entity)}
                        (neo4j/neonode :get "/marriage/findPartners")
                        (:data))
        partner-ids (map #(:partner_id %) neo-result)
        partner-entities (person/find-all-by-ids partner-ids)]
    partner-entities
    ))
