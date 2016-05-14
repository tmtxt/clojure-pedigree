(ns app.logger.log-trace.file
  (:require [app.logger.logger :as logger]
            [io.aviso.exception :as aviso-ex]))

(defn- process-data "Pretty format the data" [data]
  (cond
    (nil? data)                  ""
    (instance? Exception data)   (binding [aviso-ex/*fonts* {}] (aviso-ex/format-exception data))
    (some #(% data) [seq? map?]) (with-out-str (clojure.pprint/pprint data))
    :else                        (.toString data)
    ))

(defn- process-messages [messages]
  (for [[idx message] (map-indexed vector messages)]
    (let [{:keys [title data]} message]
      (str "[" (+ idx 1) "]" " " title (process-data data))
      )))

(defn write "Write the log-data to file" [log-data]
  (let [{correlation-id :correlationId
         level          :level
         status         :status
         request        :request
         response       :response
         process-time   :processTime
         service-name   :serviceName
         messages       :message}       log-data
        messages (process-messages messages)
        log-data {:correlationId correlation-id
                  :message (clojure.string/join "\n" messages)
                  :serviceName service-name
                  :httpData
                  {:request     request
                   :response    response
                   :status      status
                   :processTime process-time}
                  }]
    (logger/write-file level log-data)))
