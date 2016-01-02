(ns app.neo4j.main
  (:require [config.neo4j :refer [conn neonode-host neonode-port]]
            [app.neo4j.impl.statement :as stm]
            [clojurewerkz.neocons.rest.transaction :as tx]
            [clj-http.client :as client]
            [clojure.data.json :as json]))

(def ^:dynamic *tran*)
(def ^:dynamic *conn*)

(defmacro with-transaction
  "Use this macro to wrap a transaction outside of the raw execute functions.
  You have to wrap all the function inside this namespace using this macro"
  [& body]
  (let [transaction (gensym "transaction")
        connection conn]
    `(let [~transaction (clojurewerkz.neocons.rest.transaction/begin-tx ~connection)]
       (binding [app.neo4j.main/*conn* ~connection]
         (binding [app.neo4j.main/*tran* ~transaction]
           (clojurewerkz.neocons.rest.transaction/with-transaction ~connection ~transaction true
             ~@body))))))

(defn execute-statement
  "Execute the input (formatted) statement string with the arguments to replace.
  You must wrap this function inside the with-transaction macro"
  [statement & args]
  (let [query-obj (apply stm/raw-query statement args)
        [_ result] (tx/execute *conn* *tran* [query-obj])]
    result))

(def method-map
  {:get client/get
   :post client/post})

;;; call neonode api
(defn neonode [method url data]
  (let [func (get method-map method (:get method-map))
        uri (str "http://" neonode-host ":" neonode-port url)
        body (->> data (func uri) :body)
        result (json/read-str body :key-fn keyword)]
    result))
