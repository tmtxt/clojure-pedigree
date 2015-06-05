(ns app.util.main
  (:import [org.postgresql.util PGobject]))

(defn param "Get the param from the request"
  [request name & [default]]
  (get-in request [:form-params name] default))
