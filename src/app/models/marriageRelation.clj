(ns app.models.marriageRelation
  (:require [korma.core :refer :all]
            [app.util.dbUtil :as db-util]
            [app.util.neo4j.command :as ncm]
            [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.relationships :as nrl]
            [config.neo4j :refer [conn]]
            [validateur.validation :as vl]))

(def RELATION_TYPES
  {:husband-wife :husband_wife
   :wife-husband :wife_husband})

(defn add-relation-from-node
  "Add new relation between two node in the system"
  [first-node second-node order & {:keys [type]
                                   :or [type (:husband-wife RELATION_TYPES)]}]
  (ncm/create-or-update-relation :person first-node
                                 :person second-node
                                 type {:order order}))

(defn add-marriage
  "Add marriage relation between husband and wife nodes"
  [husband-node wife-node & {:keys [husband-order wife-order]
                             :or {husband-order 0 wife-order 0}}]
  (add-relation-from-node husband-node wife-node
                          husband-order
                          :type (:husband-wife RELATION_TYPES))
  (add-relation-from-node wife-node husband-node
                          wife-order
                          :type (:wife-husband RELATION_TYPES)))
