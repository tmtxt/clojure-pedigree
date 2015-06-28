(ns app.util.neo4j.command
  (:require [clojurewerkz.neocons.rest.transaction :as tx]
            [app.util.neo4j.statement :as stm]))

(def ^:dynamic *tran*)
(def ^:dynamic *conn*)

(defn create-or-update-node
  "Create or update node with connection and transaction.
  See the create-or-update-node-statement function for more info"
  ;; ([conn transaction label identifier]
  ;;  (create-or-update-node conn transaction label identifier {}))
  ([label identifier props]
   (let [statement (stm/create-or-update-node label identifier props)
         [_ result] (tx/execute *conn* *tran* [statement])
         [response] result
         row (-> response :data first :row)
         [data id] row]
     (assoc data :id id))))

;;; wrap the util function inside transaction
(defmacro with-transaction
  [connection & body]
  (let [transaction (gensym "transaction")]
    `(let [~transaction (clojurewerkz.neocons.rest.transaction/begin-tx ~connection)]
       (binding [app.util.neo4j.command/*conn* ~connection]
         (binding [app.util.neo4j.command/*tran* ~transaction]
           (clojurewerkz.neocons.rest.transaction/with-transaction ~connection ~transaction true
             ~@body))))))
