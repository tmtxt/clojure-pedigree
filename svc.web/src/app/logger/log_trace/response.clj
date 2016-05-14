(ns app.logger.log-trace.response
  (:require [config.main :refer [config]]
            [wharf.core :refer [transform-keys]]))

(def exclude-body-content-types (config :exclude-body-content-types))

(defn- filter-body "Process the response object to create the body" [response]
  (let [content-type (get-in response [:headers :content-type] "")
        exclude      (some #(.contains content-type %) exclude-body-content-types)
        body         (if exclude "Excluded" (get response :body))]
    body))

(defn- process-map-response [response]
  (let [response (transform-keys (comp keyword clojure.string/lower-case) response)
        body     (filter-body   response)
        response (assoc response :body body)]
    response
    ))

(defn- process-string-response [response]
  {:body response})

(defn process-data "Create correct schema log object from the response" [response]
  (cond
    (string? response)  (process-string-response response)
    (map? response)     (process-map-response response)
    :else               (process-string-response (.toString response))))
