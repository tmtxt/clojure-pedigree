(ns app.util.main
  (:import [org.postgresql.util PGobject]))

(defn param "Get the param from the request"
  [request name & [default]]
  (let [method (get request :request-method)]
    (cond
      (= method :get) (get-in request [:query-params name] default)
      (= method :post) (get-in request [:form-params name] default))))
