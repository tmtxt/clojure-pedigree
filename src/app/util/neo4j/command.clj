(ns app.util.neo4j.command
  (:require [clojurewerkz.neocons.rest.transaction :as tx]
            [app.util.neo4j.statement :as stm]
            [app.util.neo4j.query :as query]
            [config.neo4j :refer [conn]]))

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
     data)))

(defn create-or-update-relation
  [start-label start-identifier
   end-label end-identifier
   label props]
  (let [statement (stm/create-or-update-relation start-label start-identifier
                                                 end-label end-identifier
                                                 label props)
        [_ result] (tx/execute *conn* *tran* [statement])]
    result
    ))

;;; wrap the util function inside transaction
(defmacro with-transaction
  [connection & body]
  (let [transaction (gensym "transaction")]
    `(let [~transaction (clojurewerkz.neocons.rest.transaction/begin-tx ~connection)]
       (binding [app.util.neo4j.command/*conn* ~connection]
         (binding [app.util.neo4j.command/*tran* ~transaction]
           (clojurewerkz.neocons.rest.transaction/with-transaction ~connection ~transaction true
             ~@body))))))

(defn find-by-props
  "Find node by attr maps"
  [label props]
  (with-transaction conn
    (let [statement (stm/find-by-props label props)
          [_ result] (tx/execute *conn* *tran* [statement])
          response (first result)
          data (-> response :data first :row first)]
      data)))

(defn query-tree [root-id depth]
  (with-transaction conn
    (let [statement (stm/raw-query query/get-tree root-id depth)
          [_ result] (tx/execute *conn* *tran* [statement])
          response (first result)
          data (-> response :data)
          rows (map #(:row %) data)]
      rows)))

(defn find-root []
  (with-transaction conn
    (let [statement (stm/raw-query query/find-root)
          [_ [result]] (tx/execute *conn* *tran* [statement])
          data (-> result :data)
          rows (map #(:row %) data)]
      (if (empty? rows) nil
          (first rows)))))

(defn find-partners
  "Returns list of partner ids of the input person"
  [person-id conn]
  (with-transaction conn
    (let [statement (stm/raw-query query/find-partner person-id)
          [_ [result]] (tx/execute *conn* *tran* [statement])
          data (-> result :data)
          rows (map #(:row %) data)]
      rows)))

(defn count-parent
  "Returns the number of parent of the input person"
  [person-id conn]
  (with-transaction conn
    (let [statement (stm/raw-query query/count-parent person-id)
          [_ [result]] (tx/execute *conn* *tran* [statement])
          data (:data result)
          count (-> data first :row first)]
      count
      )))
