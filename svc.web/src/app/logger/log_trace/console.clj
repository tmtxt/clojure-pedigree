(ns app.logger.log-trace.console
  (:require [app.logger.logger :as logger]))

(defn write "Write the log-data to console" [log-data]
  (let [{correlation-id :correlationId
         level          :level
         request        :request
         response       :response
         process-time   :processTime
         messages       :message}       log-data
        {:keys [params route-params form-params query-params query-string server-name]} request
        header-request (:header request)
        {:keys [message body]} response
        header-response (:header response)]
    (logger/write-console level "--------------------------------------------------------------------------------" "")

    ;; write request information
    (logger/write-console level "REQUEST:" "")
    (logger/write-console level "Header: " header-request)
    (logger/write-console level "Params: " params)
    (logger/write-console level "Route params: " route-params)
    (logger/write-console level "Form params: " form-params)
    (logger/write-console level "Query params: " query-params)
    (logger/write-console level "Query string: " query-string)
    (logger/write-console level "Server name: " server-name)

    ;; write steps
    (logger/write-console level "STEPS" "")
    (doseq [[idx message] (map-indexed vector messages)]
      (logger/write-console
       level
       (str "[" idx "]" " " (get message :title))
       (get message :data)))

    ;; write response
    (logger/write-console level "RESPONSE:" "")
    (logger/write-console level "Header:" "")
    (logger/write-console level header-response "")
    (logger/write-console level "Message:" "")
    (logger/write-console level message "")
    (logger/write-console level "Body:" "")
    (logger/write-console level body "")

    ;; other information
    (logger/write-console level "Process time: " process-time)
    ))
