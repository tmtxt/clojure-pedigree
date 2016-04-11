(ns app.services.apilogic
  (:require [config.services :refer [api-logic-host api-logic-port]]
            [clj-http.client :as client]
            [clojure.data.json :as json]
            [slingshot.slingshot :refer [throw+]]))

(def methods
  {:get client/get
   :post client/post})

(defn- get-url "Construct the url" [url]
  (str "http://" api-logic-host ":" api-logic-port url))

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

(defn- call-api
  "Function for sending rest request to api logic server"
  [method uri & [data]]
  (let [url (get-url uri)
        params (get-params data)
        response (send-request method url params)
        result (parse-result response)]
    result))
