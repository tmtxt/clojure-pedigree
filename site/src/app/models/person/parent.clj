(ns app.models.person.parent
  (:require [app.models.person.node :as node]))

(defn count-parents [entity]
  (node/count-parents (:id entity)))

(defn enough-parents? [entity]
  (= (count-parents entity) 2))
