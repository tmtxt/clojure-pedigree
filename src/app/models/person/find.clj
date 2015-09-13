(ns app.models.person.find
  (:require [korma.core :as kc]
            [app.util.db-util :as db-util]
            [app.neo4j.node :as node]
            [app.neo4j.main :as neo4j]
            [app.neo4j.query :as query]
            [app.models.person.definition :refer [person node-to-record]]
            [app.models.person.util :as model-util]
            [app.models.person.prepare :as prepare]
            [camel-snake-kebab.extras :refer [transform-keys]]
            [camel-snake-kebab.core :refer :all]))

(defn- process-full-name [full-name]
  (if full-name ['like (str "%" full-name "%")] nil))

(defn- process-gender [gender]
  (if (vector? gender)
    ['in (map #(prepare/prepare-gender %) gender)]
    (prepare/prepare-gender gender)))

(defn- process-alive-status [alive-status]
  (prepare/prepare-alive-status alive-status))

(defn- process-birth-date [birth-date]
  (prepare/prepare-birth-date birth-date))

(defn- process-death-date [death-date]
  (prepare/prepare-death-date death-date))

(defn- process-criteria [criteria]
  (let [{full-name :full-name
         gender :gender
         alive-status :alive-status
         birth-date :birth-date
         death-date :death-date} criteria
         criteria (if full-name (->> full-name
                                     (process-full-name)
                                     (assoc criteria :full-name))
                      criteria)
         criteria (if gender (->> gender
                                  (process-gender)
                                  (assoc criteria :gender))
                      criteria)
         criteria (if alive-status (->> alive-status
                                        (process-alive-status)
                                        (assoc criteria :alive-status))
                      criteria)
         criteria (if birth-date (->> birth-date
                                      (process-birth-date)
                                      (assoc criteria :birth-date))
                      criteria)
         criteria (if death-date (->> death-date
                                      (process-death-date)
                                      (assoc criteria :death-date))
                      criteria)]
    (model-util/camel-keys->snake-keys criteria)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(defn find-entities [criteria]
  (->> criteria
       (process-criteria)
       (kc/where)
       (kc/select person)))

(defn find-entity [criteria]
  (-> criteria find-entities first))

(defn find-node-from-entity [entity]
  (if entity
    (node/find-by-props :person {:person_id (:id entity)})
    nil))

(defn find-entities-by-ids
  "Find all from postgres where id in ids list"
  [ids]
  (db-util/find-all-by-ids person ids))

(defn find-entities-by-genders [genders]
  (find-entities {:gender genders}))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(defn- extract-partner-ids [rows]
  (map (fn [[id]] id) rows))

(defn- extract-partner-id-order [rows]
  (reduce (fn [id-order [id order]] (assoc id-order id order)) {} rows))

(defn- combine-partner-info [id-order partners]
  (map (fn [partner] (assoc partner :order (get id-order (:id partner)))) partners))

(defn find-partners-of-entity
  "Find all partners information of the input person"
  [entity]
  (let [[result] (neo4j/execute-statement query/find-partner (:id entity))
        data (-> result :data)
        partners-list (map #(:row %) data)
        ids (extract-partner-ids partners-list)
        partners-id-order (extract-partner-id-order partners-list)
        partners-rows (db-util/find-all-by-ids person ids)
        partners-info (combine-partner-info partners-id-order partners-rows)]
    partners-info))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; you should use this function
(defn find-person-by
  [criteria & {:keys [include-node include-partners]
               :or {include-node false
                    include-partners false}}]
  (let [result {}
        person-entity (find-entity criteria)
        person-node (if include-node (find-node-from-entity person-entity) nil)
        partners (if include-partners (find-partners-of-entity person-entity))]
    (assoc result
           :entity person-entity
           :node person-node
           :partners partners)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;
(defn find-root-node
  "Find the root node from neo4j"
  []
  (let [[result] (neo4j/execute-statement query/find-root)
        data (-> result :data)
        rows (map #(:row %) data)
        row (first rows)
        [root] row]
    (node-to-record root)))

(defn find-root
  [& {:keys [include-node include-partners]
      :or {include-node false
           include-partners false}}]
  (let [root-node (find-root-node)
        root-person (find-person-by {:id (:person-id root-node)} :include-partners include-partners)
        root-person (if include-node (assoc root-person :node root-node) root-person)]
    root-person
    ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(defn find-person-by-id
  [id {:keys [include-node include-partners]
       :or {include-node false
            include-partners false}}]
  (find-person-by {:id id} :include-node include-node :include-partners include-partners))

(defn find-node-by-person-id [id]
  (-> id (find-person-by-id :include-node true) :node))

(defn find-entity-by-full-name [full-name]
  (-> {:full-name full-name} (find-person-by) :entity))
