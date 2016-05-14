(ns app.logger.log-trace.request
  (:require [slingshot.slingshot :refer [try+ throw+]]))

(defn- process-headers [headers content-type]
  (-> headers
      (dissoc "accept-charset")
      (assoc :content-type content-type)))

(defn- process-body [body])

(defn process-data "Create correct schema log object from the request" [request]
  (let [{:keys [headers params route-params form-params query-params
                content-type uri server-name query-string body]} request]
    {:header       (process-headers headers content-type)
     :params       params
     :route-params route-params
     :form-params  form-params
     :query-params query-params
     :query-string query-string
     :server-name  server-name}))
