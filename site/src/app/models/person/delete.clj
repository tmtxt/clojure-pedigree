(ns app.models.person.delete
  (:require [app.models.person.definition :as definition]
            [korma.core :as kc]
            [app.models.person.node :as node]
            [slingshot.slingshot :refer [throw+ try+]]))

(defn delete-person [id]
  (node/delete id)
  (kc/delete definition/person
             (kc/where {:id id})))
