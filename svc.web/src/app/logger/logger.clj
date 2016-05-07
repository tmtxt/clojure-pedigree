(ns app.logger.logger
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [taoensso.timbre :as timbre]
            [clojure.data.json :as json]
            [taoensso.timbre.appenders.core :as appenders]))

(defn json-output-fn
  "Jsonify output function for file appender"
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
   :appenders {:println {:enable? true}
               :spit (merge (appenders/spit-appender {:fname "/logs/svc.web.log"})
                            {:output-fn json-output-fn})}
   :timestamp-opts {:pattern "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                    :locale :jvm-default
                    :timezone :utc}})

(timbre/merge-config! timbre-config)
