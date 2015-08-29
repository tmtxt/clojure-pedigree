(ns app.neo4j.main
  (:require [config.neo4j :refer [conn]]
            [app.neo4j.impl.statement :as stm]
            [clojurewerkz.neocons.rest.transaction :as tx]))

(def ^:dynamic *tran*)
(def ^:dynamic *conn*)

;;; Macro for wrapping out the execute/update functions inside this namespace
;;; The execute/update functions are required to be wrapped by this macro
;;; The query function are freely to use (wrapped automatically)
(defmacro with-transaction
  "Use this macro to wrap a transaction outside of the raw execute functions.
  The execute/update functions are required to be wrapped by this macro
  The query function are freely to use (wrapped automatically)"
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
