(ns app.services.util
  (:refer-clojure :exclude [methods])
  (:require [config.main :refer [config]]
            [clj-http.client :as client]
            [clojure.data.json :as json]
            [camel-snake-kebab.core :refer [->camelCaseString ->kebab-case-keyword]]
            [slingshot.slingshot :refer [throw+]]
            [app.logger.log-trace :as log-trace]))

(def methods
  {:get client/get
   :post client/post})

(def services-map (config :services))

(defn- get-url "Construct the url" [host port url]
  (str "http://" host ":" port url))

(defn- get-params "Construct the params to send" [data]
  {:content-type :json
   :body (json/write-str data :key-fn ->camelCaseString)
   :headers {:correlationId (log-trace/get-id)}})

(defn- send-request "Send the request to api logic server" [method url params]
  (let [func (get methods method client/get)]
    (->> params (func url) :body)))

(defn- parse-result "Parse the final result" [body]
  (let [result (json/read-str body :key-fn ->kebab-case-keyword)]
    (when (not (result :success))
      (throw+ result))
    result))

(defn- get-result "Parse the final result" [body]
  (let [result (json/read-str body :key-fn ->kebab-case-keyword)]
    (when (not (result :success))
      (do
        (log-trace/add :info "(app.services.util.get-result)"
                       (str "Error in calling to service"))
        (throw+ result)))
    (:data result)))

(defn call
  "Function for sending rest request"
  [service uri method & [data]]
  (let [data (if data data {})
        host (get-in services-map [service :host])
        port (get-in services-map [service :port])
        url (get-url host port uri)
        params (get-params data)
        response (send-request method url params)
        result (parse-result response)]
    result))

(defn call-json
  "Function for sending rest request"
  [service uri method & [data]]
  (log-trace/add :info "(app.services.util.call-json)"
                 (str "Start calling to service " service))
  (let [data (if data data {})
        host (get-in services-map [service :host])
        port (get-in services-map [service :port])
        url (get-url host port uri)
        params (get-params data)
        response (send-request method url params)
        result (get-result response)]
    (log-trace/add :info "(app.services.util.call-json)"
                   (str "Finished calling to service " service))
    result))

(defn call-multipart
  "Function for sending rest request with multipart form data"
  [service uri method & [data]]
  (let [data (if data data {})
        host (get-in services-map [service :host])
        port (get-in services-map [service :port])
        url (get-url host port uri)
        params {:multipart data}
        response (send-request method url params)
        result (parse-result response)]
    result))
