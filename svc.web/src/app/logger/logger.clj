(ns app.logger.logger
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [taoensso.timbre :as timbre]
            [clojure.data.json :as json]
            [taoensso.timbre.appenders.core :as appenders]
            [cheshire.core :refer [encode]]
            [cheshire.generate :refer [add-encoder encode-str]]))

(add-encoder org.eclipse.jetty.server.HttpInput encode-str)

(defn- json-output-fn
  "Jsonify output function for file appender"
  [{:keys [vargs_ hostname_ timestamp_ level] :as args}]
  (let [messages (map (fn [msg] (merge msg
                                      {:timestamp @timestamp_
                                       :level     level
                                       :hostname  @hostname_}))
                      @vargs_)
        json-messages (map #(encode %) messages)]
    (clojure.string/join "\n" json-messages)))

(def println-config
  {:level :trace})

(def spit-config
  {:level :debug
   :appenders {:spit (merge (appenders/spit-appender {:fname "/logs/svc.web.log"})
                            {:output-fn json-output-fn})}
   ;; :appenders {:spit (appenders/spit-appender {:fname "/logs/svc.web.log"})}
   :timestamp-opts {:pattern "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                    :locale :jvm-default
                    :timezone :utc}})

;;; have to wrap the macro in a function...
(def LEVEL_MAPS
  {:trace  #(timbre/trace %1 %2)
   :debug  #(timbre/debug %1 %2)
   :info   #(timbre/info %1 %2)
   :warn   #(timbre/warn %1 %2)
   :error  #(timbre/error %1 %2)
   :fatal  #(timbre/fatal %1 %2)
   :report #(timbre/report %1 %2)})

(defn- write "Write log file" [level data]
  (let [level (keyword level)
        func (get LEVEL_MAPS level #(timbre/info %))]
    (func data)))

(defn write-console "Write log data to console" [level title & [data]]
  (timbre/with-merged-config println-config
    (let [level (keyword level)
          func (get LEVEL_MAPS level #(timbre/info %))]
      (func title data))))

(defn write-file "Write log data to file" [level data]
  (timbre/with-config spit-config
    (let [level (keyword level)
          func (get LEVEL_MAPS level #(timbre/info %))]
      (func data {}))))
