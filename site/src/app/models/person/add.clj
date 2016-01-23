(ns app.models.person.add
  (:require [app.models.person.definition :refer [person]]
            [korma.core :refer [insert values]]
            [slingshot.slingshot :refer [throw+ try+]]
            [app.models.person.node :refer [add-or-update] :rename {add-or-update add-node}]))

(defn- add-person-entity
  "Add person entity to Postgres"
  [data]
  (insert person (values data)))

(defn- add-person-node
  "Add person node in Neo4j for person entity"
  [entity is-root]
  (add-node {:person_id (:id entity)
             :is_root is-root}))

(defn add-person
  "Add new person into postgres and neo4j."
  [data & {:keys [is-root]
           :or {is-root false}}]
  (let [entity (add-person-entity data)
        node (add-person-node entity is-root)]
    {:success true
     :entity entity
     :node node}))
