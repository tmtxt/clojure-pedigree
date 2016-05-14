(ns app.logger.log-trace.steps
  (:require [cheshire.core :refer [encode]]
            [io.aviso.exception :as aviso-ex]))

(defn- process-data "Pretty format the data" [data]
  (cond
    (nil? data)                  ""
    (instance? Exception data)   (binding [aviso-ex/*fonts* {}] (aviso-ex/format-exception data))
    (some #(% data) [seq? map?]) (with-out-str (clojure.pprint/pprint data))
    :else                        (.toString data)
    ))

(defn add-step "Add a new step into the steps vector" [steps level title & [data]]
  (let [level (-> level keyword name)
        data  (process-data data)
        step  {:level level
               :title title
               :data  data}]
    (conj steps step)))
