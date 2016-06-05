(ns app.util.main
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [response]]
            [camel-snake-kebab.extras :refer [transform-keys]]
            [camel-snake-kebab.core :refer [->camelCaseString]]))

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
  (let [types [:params :query-params :form-params]
        to-keyword #(into {} (for [[k v] %]
                               [(keyword k) v]))
        reduce-fn #(let [params (get request %2 {})
                         params (to-keyword params)]
                     (merge %1 params))]
    (reduce reduce-fn {} types)
    ))

(defn parse-int "Parse the input to integer"
  [input & [default]]
  (try+
   (when (integer? input) (throw+ input))
   (Integer/parseInt input)
   (catch integer? i i)
   (catch Object _ default)))

(defn response-success [data & [message]]
  (response {:success true
             :data (transform-keys ->camelCaseString data)
             :message message}))
