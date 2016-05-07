(ns app.util.model
  (:require [camel-snake-kebab.core :refer [->kebab-case ->snake_case]]
            [camel-snake-kebab.extras :refer [transform-keys]]))

(defn entity->record
  "Convert korma entity to record using func, transform all keys to kebab case"
  [entity func]
  (->> entity (transform-keys ->kebab-case) func))

(defn record->entity
  "Convert record back to database entity map, transform all keys to snake case"
  [record]
  (transform-keys ->snake_case record))
