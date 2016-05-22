(ns app.controllers.person.find
  (:require [app.models.person :as person]
            [ring.util.response :refer [response]]
            [app.util.main :as util]
            [app.services.person :as svc-person]
            [app.services.marriage-relation :as svc-mr]
            [app.definition.person :as person-def]
            [app.logger.log-trace :as log-trace]))

(defn- get-genders-by-parent-role
  "Get all the possible genders for this parent role"
  [role]
  (let [genders-map person-def/genders-map]
    (cond
      (= role "father") [(genders-map :male)
                         (genders-map :les)
                         (genders-map :unknown)]
      (= role "mother") [(genders-map :female)
                         (genders-map :gay)
                         (genders-map :unknown)]
      :else [(genders-map :male)
             (genders-map :les)
             (genders-map :female)
             (genders-map :gay)
             (genders-map :unknown)])))

(defn- find-partners-of-person-id [person-id]
  (let [
        ;; find parent node
        _ (log-trace/add :info "(find-partners-of-person-id)" (str "Find person by id " person-id))
        parent              (svc-person/find-by-id person-id)
        {parent-node :node} parent
        _ (log-trace/add :info "(find-partners-of-person-id)"
                         (str "Found person node id " (:id parent-node)))

        ;; find partner nodes
        partner-nodes  (svc-mr/find-partner-node (:id parent-node))
        partner-entities (map #(-> % :partner-id svc-person/find-by-id :entity) partner-nodes)
        ]
    partner-entities))

(defn find-list-simple [request]
  (let [
        ;; extract the params from the request
        params       (util/params request)
        {parent-id    :parentId
         person-name  :term
         parent-role  :parentRole} params]

    (cond
      ;; TODO update this later
      (and parent-id person-name)
      (let [persons (svc-person/find-by-name person-name)
            persons (map #(:entity %) persons)]
        (response persons))

      ;; TODO update this later
      (and parent-role person-name)
      (let [persons (svc-person/find-by-name person-name)
            persons (map #(:entity %) persons)]
        (response persons))

      parent-role
      (let [genders (get-genders-by-parent-role parent-role)
            persons (svc-person/find-by-genders genders)
            persons (map #(:entity %) persons)]
        (response persons))

      parent-id
      (let [parent-id (util/parse-int parent-id)
            persons  (find-partners-of-person-id parent-id)]
        (response persons))

      person-name
      (let [persons (svc-person/find-by-name person-name)
            persons (map #(:entity %) persons)]
        (response persons))

      :else
      (response [])
      )))
