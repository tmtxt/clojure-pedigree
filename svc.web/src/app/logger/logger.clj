(ns app.logger.logger
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [taoensso.timbre :as timbre]
            [clojure.data.json :as json]
            [taoensso.timbre.appenders.core :as appenders]))

(defn- json-output-fn
  "Jsonify output function for file appender"
  [{:keys [vargs_ hostname_ timestamp_ level] :as args}]
  (let [messages (map (fn [msg] (merge msg
                                      {:timestamp @timestamp_
                                       :level     level
                                       :hostname  @hostname_}))
                      @vargs_)
        json-messages (map (fn [v] (json/write-str
                                   v
                                   :value-fn
                                   (fn [key value]
                                     (.toString value)
                                     )))
                           messages)]
    (clojure.string/join "\n" json-messages)))

(def println-config
  {:level :trace})

(def spit-config
  {:level :debug
   :appenders {:spit (merge (appenders/spit-appender {:fname "/logs/svc.web.log"})
                            {:output-fn json-output-fn})}
   :timestamp-opts {:pattern "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                    :locale :jvm-default
                    :timezone :utc}})

;;; have to wrap the macro in a function...
(def LEVEL_MAPS
  {:trace  #(timbre/trace %)
   :debug  #(timbre/debug %)
   :info   #(timbre/info %)
   :warn   #(timbre/warn %)
   :error  #(timbre/error %)
   :fatal  #(timbre/fatal %)
   :report #(timbre/report %)})

(defn- write "Write log file" [level data]
  (let [level (keyword level)
        func (get LEVEL_MAPS level #(timbre/info %))]
    (func data)))

(defn write-console "Write log data to console" [level data]
  (timbre/with-merged-config println-config
    (write level data)))

(defn write-file "Write log data to file" [level data]
  (timbre/with-config spit-config
    (write level data)))
