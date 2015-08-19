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
