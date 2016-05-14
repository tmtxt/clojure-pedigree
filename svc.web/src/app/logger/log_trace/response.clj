(ns app.logger.log-trace.response
  (:require [config.main :refer [config]]
            [cheshire.core :refer [encode]]
            [wharf.core :refer [transform-keys]]))

(def exclude-body-content-types
  (get-in config [:logs :exclude-body-content-types]))

(defn- stringify "JSON Stringify the input object" [obj]
  (encode obj {:pretty true}))

(defn- filter-body "Process the response object to create the body" [response]
  (let [content-type (get-in response [:headers "Content-Type"] "")
        exclude      (some #(.contains content-type %) exclude-body-content-types)
        body         (if exclude "Too long, excluded!" (get response :body))
        body         (if (string? body) body (stringify body))]
    body))

(defn- filter-header "Process the response object to create the header" [response]
  (let [{header :headers} response]
    (stringify header)))

(defn- process-map-response [response]
  (let [body     (filter-body   response)
        header   (filter-header response)
        {status  :status
         message :message} response]
    {:body    body
     :header  header
     :status  status
     :message message}))

(defn- process-string-response [response]
  {:body response})

(defn process-data "Create correct schema log object from the response" [response]
  (cond
    (string? response)  (process-string-response response)
    (map? response)     (process-map-response response)
    :else               (process-string-response (.toString response))))
