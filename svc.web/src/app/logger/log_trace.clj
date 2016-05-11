(ns app.logger.log-trace
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [clj-uuid :as uuid]
            [app.util.main :as util]
            [clj-time.core :as t]
            [clj-time.coerce :as c]
            [com.rpl.specter :refer [select ALL]]
            [io.aviso.exception :as aviso-ex]
            [clojure.string :refer [upper-case join]]
            [app.logger.logger :as logger]))

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
   :serviceName    "svc.web"
   :startedAt      (c/to-long (t/now))
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
    (instance? Exception data)   (binding [aviso-ex/*fonts* {}] (aviso-ex/format-exception data))
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

(defn- calculate-process-time "Calculate the process time of this request in ms" [log-data]
  (let [started-at   (get log-data :startedAt)
        finished-at  (c/to-long (t/now))
        process-time (- finished-at started-at)]
    (str process-time " ms")))

(defn- write-console "Process log data and write to console" [log-data level]
  (let [correlation-id (get log-data :correlationId)
        request        (get log-data :request)
        process-time   (get log-data :processTime)
        response       (get log-data :response)
        messages       (get log-data :message)]
    (logger/write-console level "Correlation Id: " correlation-id)
    (logger/write-console level "Request: \n" (with-out-str (clojure.pprint/pprint request)))
    (logger/write-console level "Steps" "")
    (doseq [[idx message] (map-indexed vector messages)]
      (logger/write-console
       level
       (str "[" idx "]" " " (get message :title))
       (get message :data)))
    (logger/write-console level "Response: \n" (with-out-str (clojure.pprint/pprint response)))
    (logger/write-console level "Process time: " process-time)))

(defn- write-file "Process log data and write to file" [log-data level]
  (let [log-data (update log-data :message process-messages)]
    (logger/write-file level log-data)))

(defn end "End the log trace session and write log" []
  (let [log-data *log-data*

        level    (detect-log-level       log-data)
        time     (calculate-process-time log-data)
        status   (get-in log-data [:response :status])

        log-data (dissoc log-data :startedAt)
        log-data (assoc  log-data :level       level)
        log-data (assoc  log-data :status      status)
        log-data (assoc  log-data :processTime time)]
    (write-console log-data level)
    ;; (write-file    log-data level)
    (set! *log-data* {})))

(defn- handle-exception "Handle uncaught exception in request handler" [ex]
  (add :error "Uncaught exception" ex)
  (add :info  "Request ends")
  (let [response (ring.util.response/response {:message "Có lỗi xảy ra"})
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
