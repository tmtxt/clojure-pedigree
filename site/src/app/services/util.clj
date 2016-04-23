(ns app.services.util
  (:require [config.services :refer :all]
            [clj-http.client :as client]
            [clojure.data.json :as json]
            [camel-snake-kebab.core :refer [->camelCaseString ->kebab-case-keyword]]
            [camel-snake-kebab.extras :refer [transform-keys]]
            [slingshot.slingshot :refer [throw+]]))

(def methods
  {:get client/get
   :post client/post})

(def services-map
  {:svc-user {:host svc-user-host
              :port svc-user-port}
   :svc-minor-content {:host svc-minor-content-host
                       :port svc-minor-content-port}
   :svc-person {:host svc-person-host
                :port svc-person-port}
   :svc-pedigree-relation {:host svc-pedigree-relation-host
                           :port svc-pedigree-relation-port}})

(defn- get-url "Construct the url" [host port url]
  (str "http://" host ":" port url))

(defn- get-params "Construct the params to send" [data]
  {:content-type :json
   :body (json/write-str data :key-fn ->camelCaseString)})

(defn- send-request "Send the request to api logic server" [method url params]
  (let [func (get methods method client/get)]
    (->> params (func url) :body)))

(defn- parse-result "Parse the final result" [body]
  (let [result (json/read-str body :key-fn ->kebab-case-keyword)]
    (when (not (result :success))
      (throw+ result))
    result))

(defn call
  "Function for sending rest request to api logic server"
  [service uri method & [data]]
  (let [data (if data data {})
        host (get-in services-map [service :host])
        port (get-in services-map [service :port])
        url (get-url host port uri)
        params (get-params data)
        response (send-request method url params)
        result (parse-result response)]
    result))
