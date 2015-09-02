(ns app.util.main
  (:import [org.postgresql.util PGobject]))

(defn param "Get the param from the request"
  [request name & [default]]
  (let [name-kw (keyword name)
        path-param (get-in request [:params name-kw])
        query-param (get-in request [:query-params name])
        form-param (get-in request [:form-params name])]
    (cond
      path-param path-param
      query-param query-param
      form-param form-param
      :else default
      )))

(defn params "Get al the params from request as a map"
  [request]
  (let [path-params (get request :params {})
        path-params (into {} (for [[k v] path-params]
                               [(keyword k) v]))
        query-params (get request :query-params {})
        form-params (get request :form-params {})]
    (merge path-params query-params form-params)))

(defn parse-int "Parse the input to integer"
  [input & [default]]
  (if (integer? input) input
      (try
        (Integer/parseInt input)
        (catch Exception e default))))
