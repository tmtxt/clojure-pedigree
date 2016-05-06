(ns app.logger.log-trace
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [clj-uuid :as uuid]
            [app.util.main :as util]
            [clj-time.core :as t]))

;;; The var that contains all the logging information for this request
(def ^:dynamic *log-data*)

(defn- get-correlation-id "Get correlationId from request object" [request]
  (get-in request
          [:headers "correlation-id"]
          (.toString (uuid/v4))))

(defn- filter-request "Filter the request object for necessary keys" [request]
  (-> request
      (update-in   [:headers] dissoc "accept-charset")
      (select-keys [:params :route-params :form-params :query-params
                    :content-type :uri :server-name :query-string
                    :headers :body])))

(defn- create-default-log-data
  "Create the default log data from the request, used when start processing the request"
  [request]
  {:message        [{:level "info"
                     :mgs "Start processing request"
                     :data ""}]
   :serviceName    "web.server"
   :request        (filter-request     request)
   :correlationId  (get-correlation-id request)})

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
