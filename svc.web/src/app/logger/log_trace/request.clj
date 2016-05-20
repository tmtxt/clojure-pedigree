(ns app.logger.log-trace.request
  (:require [cheshire.core :refer [encode]]
            [cheshire.generate :refer [add-encoder encode-str encode-map]]))

(add-encoder org.eclipse.jetty.server.HttpInput encode-str)
(add-encoder
 java.io.File
 (fn [file json-gen]
   (encode-map
    {:absolute-path (.getAbsolutePath file)
     :name          (.getName file)
     :to-string     (.toString file)}
    json-gen)))

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
