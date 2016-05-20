(ns app.logger.log-trace.request
  (:require [cheshire.core :refer [encode]]))

(defn- process-headers [headers]
  (-> headers
      (dissoc "accept-charset")))

(defn- stringify "JSON Stringify the input object" [obj]
  (encode obj {:pretty true}))

(defn process-data "Create correct schema log object from the request" [request]
  (let [{:keys [headers params route-params form-params query-params
                uri server-name query-string body]} request]
    {:header       (-> headers process-headers stringify)
     :params       (stringify params)
     :route-params (stringify route-params)
     :form-params  (stringify form-params)
     :query-params (stringify query-params)
     :query-string query-string
     :server-name  server-name
     :uri          uri}))
