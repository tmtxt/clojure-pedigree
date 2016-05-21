(ns app.logger.logger
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [taoensso.timbre :as timbre]
            [clojure.data.json :as json]
            [taoensso.timbre.appenders.core :as appenders]
            [cheshire.core :refer [encode]]
            [environ.core :refer [env]]))

(def CONSOLE_ENABLE?
  (if (= (:log-console env) "true") true false))

(def FILE_ENABLE?
  (if (= (:log-file env) "true") true false))

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
  {:level :trace
   :appenders {:println {:enabled? CONSOLE_ENABLE?}}
   })

(def spit-config
  {:level :debug
   :appenders {:spit (merge (appenders/spit-appender {:fname "/logs/svc.web.log"})
                            {:output-fn json-output-fn
                             :enabled? FILE_ENABLE?})}
   :timestamp-opts {:pattern "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                    :locale :jvm-default
                    :timezone :utc}})

(defn write-console "Write log data to console" [level title & [data]]
  (let [funcs {:trace  #(timbre/trace %1 %2)
               :debug  #(timbre/debug %1 %2)
               :info   #(timbre/info %1 %2)
               :warn   #(timbre/warn %1 %2)
               :error  #(timbre/error %1 %2)
               :fatal  #(timbre/fatal %1 %2)
               :report #(timbre/report %1 %2)}]
    (timbre/with-merged-config println-config
      (let [level (keyword level)
            func (get funcs level #(timbre/info %))]
        (func title data)))))

(defn write-file "Write log data to file" [level data]
  (let [funcs {:trace  #(timbre/trace %1)
               :debug  #(timbre/debug %1)
               :info   #(timbre/info %1)
               :warn   #(timbre/warn %1)
               :error  #(timbre/error %1)
               :fatal  #(timbre/fatal %1)
               :report #(timbre/report %1)}]
    (timbre/with-config spit-config
      (let [level (keyword level)
            func (get funcs level #(timbre/info %))]
        (func data)))))
