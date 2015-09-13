(ns app.models.person.find
  (:require [korma.core :as kc]
            [app.models.person.definition :refer [person]]
            [app.models.person.util :as model-util]
            [camel-snake-kebab.extras :refer [transform-keys]]
            [camel-snake-kebab.core :refer :all]))

(defn- process-full-name [full-name]
  (if full-name ['like (str "%" full-name "%")] nil))

(defn- process-criteria [criteria]
  (let [{full-name :full-name} criteria
        criteria (if full-name (->> full-name
                                   (process-full-name)
                                   (assoc criteria :full-name))
                     criteria)]
    (model-util/camel-keys->snake-keys criteria)))

(defn find-person-by
  [criteria]
  (->> criteria
       (process-criteria)
       (kc/where)
       (kc/select person)
       (first)))
