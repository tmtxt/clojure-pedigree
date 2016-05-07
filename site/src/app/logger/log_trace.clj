(ns app.logger.log-trace
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [clj-uuid :as uuid]
            [app.util.main :as util]
            [clj-time.core :as t]
            [com.rpl.specter :refer [select ALL]]
            [io.aviso.exception :as aviso-ex]
            [clojure.string :refer [upper-case join]]))

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
                     :title "Start processing request"
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
  (cond
    (string? response) response
    (map? response)    (let [content-type (get-in response [:headers "Content-Type"] "")
                             exclude      (some #(.contains content-type %) EXCLUDED-RESPONSE-CONTENT-TYPES)
                             body         (if exclude "Not included" (get response :body))
                             response     (assoc response :body body)]
                         response)
    :else              (.toString response)))

(defn- make-post-request-data
  "Create the default log data from the response, used before finish processing the request"
  [response]
  (assoc *log-data* :response response))

(defn- process-data "Pretty format the data" [data]
  (cond
    (nil? data)                  ""
    (instance? Exception data)   (aviso-ex/format-exception data)
    (some #(% data) [seq? map?]) (with-out-str (clojure.pprint/pprint data))
    :else                        (.toString data)
    ))

(defn add "Add new entry to the log trace" [level title & [data]]
  (let [level     (-> level keyword name)
        data      (process-data data)
        log-entry {:level level
                   :title title
                   :data  data}
        log-data  (update *log-data* :message conj log-entry)]
    (set! *log-data* log-data)))

(defn- process-messages "Concat all the message entries to one big message" [messages]
  (let [func (fn [idx entry]
               (str "[" (+ idx 1) "]" " "
                    (-> entry :level upper-case) " "
                    (:title entry) " "
                    (:data entry)))]
    (->> messages (map-indexed func) (join "\n"))))

(defn end "End the log trace session and write log" []
  (let [log-data *log-data*
        log-data (update log-data :message process-messages)]
    (clojure.pprint/pprint log-data)))

(defn- handle-exception "Handle uncaught exception in request handler" [ex]
  (add :error "Uncaught exception" ex)
  (add :info  "Request ends")
  (let [response {:body    "Có lỗi xảy ra"
                  :status  400,
                  :headers {"Content-Type" "text/plain; charset=utf-8"}}
        log-data (make-post-request-data response)]
    (set! *log-data* log-data)
    (end)
    response))

(defn- handle-no-exception "Handle for the case no exception is thrown" [response]
  (when (map? response)
    (let [status (get response :status 200)]
      (when (> status 300)
        (add :error "Server response with error" status))))
  (add :info "Request ends")
  (let [log-data (make-post-request-data response)]
    (set! *log-data* log-data))
  (end)
  response)

(defn wrap-log-trace [handler]
  (fn [request]
    (binding [*log-data* (make-pre-request-data request)]
      (try+
       (let [response (handler request)]
         (handle-no-exception response))
       (catch Object ex (handle-exception ex))))))
