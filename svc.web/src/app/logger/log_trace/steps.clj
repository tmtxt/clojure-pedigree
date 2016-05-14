(ns app.logger.log-trace.steps
  (:require [cheshire.core :refer [encode]]))

(defn add-step "Add a new step into the steps vector" [steps level title & [data]]
  (let [level (-> level keyword name)
        data  data
        step  {:level level
               :title title
               :data  data}]
    (conj steps step)))
