(ns app.models.person.util
  (:require [camel-snake-kebab.core :refer :all]
            [camel-snake-kebab.extras :refer [transform-keys]]
            [app.util.db-util :as db-util]))

(defn camel-keys->snake-keys [record]
  (transform-keys ->snake_case record))
