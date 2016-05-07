(ns app.logger.log-trace
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [clj-uuid :as uuid]
            [app.util.main :as util]
            [clj-time.core :as t]
            [com.rpl.specter :refer [select ALL]]))

;;; The var that contains all the logging information for this request
(def ^:dynamic *log-data*)

(def EXCLUDED-RESPONSE-CONTENT-TYPES
  ["text/html"])

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

(defn- make-pre-request-data
  "Create the default log data from the request, used when start processing the request"
  [request]
  {:message        [{:level "info"
                     :mgs "Start processing request"
                     :data ""}]
   :serviceName    "web.server"
   :request        (filter-request     request)
   :correlationId  (get-correlation-id request)})

(defn- detect-log-level
  "Detect the overall log level based on the messages. Try each level from error -> warn -> info (default)"
  [log-data]
  (let [mgs       (get log-data :message [])
        get-level (fn [level] (first (select [ALL :level #(= level %)] mgs)))
        levels    [(get-level "error") (get-level "warn") "info"]
        level     (first (select [ALL #(not (nil? %))] levels))]
    level))

(defn- filter-response "Filter the response object for necessary keys" [response]
  ;; remove body if too long
  (let [content-type (get-in response [:headers "Content-Type"] "")
        exclude      (some #(.contains content-type %) EXCLUDED-RESPONSE-CONTENT-TYPES)
        body         (if exclude "Not included" (get response :body))
        response     (assoc response :body body)]
    response))

(defn- make-post-request-data
  "Create the default log data from the response, used before finish processing the request"
  [response]
  (assoc *log-data* :response response))

(defn wrap-log-trace [handler]
  (fn [request]
    (binding [*log-data* (make-pre-request-data request)]
      (try+
       (let [response (handler request)]
         (set! *log-data* (make-post-request-data response))
         (clojure.pprint/pprint *log-data*)
         response)
       (catch Object _ "error")))))

(defn add [level message data]
  (let [log-data (get *log-data* :message [])
        log-data (conj log-data message)]
    (set! *log-data* (assoc *log-data* :message log-data))))