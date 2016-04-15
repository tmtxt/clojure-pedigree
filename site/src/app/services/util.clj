(ns app.services.util
  (:require [config.services :refer :all]
            [clj-http.client :as client]
            [clojure.data.json :as json]
            [slingshot.slingshot :refer [throw+]]))

(def methods
  {:get client/get
   :post client/post})

(def hosts
  {:svc-user svc-user-host})

(defn- get-url "Construct the url" [host url]
  (str "http://" host ":" api-logic-port url))

(defn- get-params "Construct the params to send" [data]
  {:content-type :json
   :body (json/write-str data)})

(defn- send-request "Send the request to api logic server" [method url params]
  (let [func (get methods method client/get)]
    (->> params (func url) :body)))

(defn- parse-result "Parse the final result" [body]
  (let [result (json/read-str body :key-fn keyword)]
    (when (not (result :success))
      (throw+ result))
    result))

(defn call
  "Function for sending rest request to api logic server"
  [service uri method & [data]]
  (let [data (if data data {})
        host (get hosts service)
        url (get-url host uri)
        params (get-params data)
        response (send-request method url params)
        result (parse-result response)]
    result))
