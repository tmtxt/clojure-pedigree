(ns app.logger.log-trace
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [clj-uuid :as uuid]
            [app.util.main :as util]
            [clj-time.core :as t]))

(def ^:dynamic *log-data*)

(defn- create-default-log-data [request]
  (let [message ["Start processing request"]
        service-name "web.server"
        request {:data (util/params request)}]
    {:message message
     :serviceName service-name
     :request request}))

(defn wrap-log-trace [handler]
  (fn [request]
    (binding [*log-data* (create-default-log-data request)]
      (try+
       (let [response (handler request)]
         (set! *log-data* (assoc *log-data* :response response))
         (clojure.pprint/pprint *log-data*)
         response)
       (catch Object _ "error")))))

(defn add [level message data]
  (let [log-data (get *log-data* :message [])
        log-data (conj log-data message)]
    (set! *log-data* (assoc *log-data* :message log-data))))
