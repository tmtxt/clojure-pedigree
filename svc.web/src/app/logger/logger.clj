(ns app.logger.logger
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [taoensso.timbre :as timbre]
            [clojure.data.json :as json]))

(defn json-output-fn
  [{:keys [vargs_ hostname_ timestamp_ level] :as args}]
  (let [messages (map (fn [msg] (merge msg
                                      {:timestamp @timestamp_
                                       :level     level
                                       :hostname  @hostname_}))
                      @vargs_)
        json-messages (map #(json/write-str %) messages)]
    (clojure.string/join "\n" json-messages)))

(def timbre-config
  {:level :debug
   :appenders {:println {:output-fn json-output-fn}}
   :timestamp-opts {:pattern "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", :locale :jvm-default, :timezone :utc}})

(timbre/merge-config! timbre-config)
