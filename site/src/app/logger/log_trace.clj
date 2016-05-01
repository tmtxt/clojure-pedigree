(ns app.logger.log-trace
  (:require [slingshot.slingshot :refer [try+ throw+]]))

(def ^:dynamic *log-data*)

(defn- create-default-log-data []
  {:message []})

(defn wrap-log-trace [handler]
  (fn [request]
    (binding [*log-data* (create-default-log-data)]
      (try+
       (set! *log-data* (assoc *log-data* :request request))
       (let [response (handler request)]
         (set! *log-data* (assoc *log-data* :response response))
         response)
       (catch Object _ "error")))))

(defn add [level message data]
  (let [log-data (get *log-data* :message [])
        log-data (conj log-data {:level level
                                 :message message
                                 :data data})]
    (set! *log-data* (assoc *log-data* :message log-data))))
