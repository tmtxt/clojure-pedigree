(ns app.neo4j.main
  (:require [config.neo4j :refer [neonode-host neonode-port]]
            [clj-http.client :as client]
            [clojure.data.json :as json]))

(def method-map
  {:get client/get
   :post client/post})

;;; call neonode api
(defn neonode [method url data]
  (let [func (get method-map method (:get method-map))
        uri (str "http://" neonode-host ":" neonode-port url)
        params {:content-type :json
                :body (json/write-str data)}
        body (->> params (func uri) :body)
        result (json/read-str body :key-fn keyword)]
    result))
