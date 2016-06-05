(ns app.logger.log-trace
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [app.logger.log-trace.steps :refer [add-step]]
            [app.logger.log-trace.request
             :refer [process-data]
             :rename {process-data process-request-data}]
            [app.logger.log-trace.response
             :refer [process-data]
             :rename {process-data process-response-data}]
            [app.logger.log-trace.console :as console]
            [app.logger.log-trace.file :as file]
            [clj-uuid :as uuid]
            [app.util.main :as util]
            [clj-time.core :as t]
            [clj-time.coerce :as c]
            [com.rpl.specter :refer [select ALL]]
            [io.aviso.exception :as aviso-ex]
            [clojure.string :refer [upper-case join]]
            [app.logger.logger :as logger]))

;;; The var that contains all the logging information for this request
(def ^:dynamic *log-data* {})

(defn- get-correlation-id "Get correlationId from request object" [request]
  (get-in request
          [:headers "correlation-id"]
          (.toString (uuid/v4))))

(defn- make-pre-request-data
  "Create the default log data from the request, used when start processing the request"
  [request]
  {:message        [{:level "info"
                     :title "Start processing request"
                     :data ""}]
   :serviceName    "svc.web"
   :startedAt      (c/to-long (t/now))
   :request        (process-request-data request)
   :correlationId  (get-correlation-id request)})

(defn- detect-log-level
  "Detect the overall log level based on the messages. Try each level from error -> warn -> info (default)"
  [log-data]
  (let [mgs       (get log-data :message [])
        get-level (fn [level] (first (select [ALL :level #(= level %)] mgs)))
        levels    [(get-level "error") (get-level "warn") "info"]
        level     (first (select [ALL #(not (nil? %))] levels))]
    level))

(defn- make-post-request-data
  "Create the default log data from the response, used before finish processing the request"
  [response]
  (assoc *log-data* :response (process-response-data response)))

(defn add "Add new entry to the log trace" [level title & data]
  (let [steps    (add-step (:message *log-data*) level title data)
        log-data (assoc *log-data* :message steps)]
    (set! *log-data* log-data)))

(defn- calculate-process-time "Calculate the process time of this request in ms" [log-data]
  (let [started-at   (get log-data :startedAt)
        finished-at  (c/to-long (t/now))
        process-time (- finished-at started-at)]
    (str process-time " ms")))

(defn end "End the log trace session and write log" []
  (let [log-data *log-data*

        level    (detect-log-level       log-data)
        time     (calculate-process-time log-data)
        status   (get-in log-data [:response :status])

        log-data (dissoc log-data :startedAt)
        log-data (assoc  log-data :level       level)
        log-data (assoc  log-data :status      status)
        log-data (assoc  log-data :processTime time)]
    (console/write log-data)
    (file/write    log-data)
    (set! *log-data* {})))

(defn- handle-exception "Handle uncaught exception in request handler" [ex]
  (add :error "Uncaught exception" ex)
  (add :info  "Request ends")
  (let [response (ring.util.response/response {:success false
                                               :message "Có lỗi xảy ra"})
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

(defn get-id "Get correlation id of the current request session" []
  (get *log-data* :correlationId (.toString (uuid/v4))))
