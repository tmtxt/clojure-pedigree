(ns app.views.layout
  (:require [selmer.parser :as parser]
            [ring.util.response :refer [content-type response]]
            [compojure.response :refer [Renderable]]))

(parser/set-resource-path! (clojure.java.io/resource "templates"))
(parser/cache-off!)

(defn utf-8-response [html]
  (content-type (response html) "text/html; charset=utf-8"))

(defn render [template & [params]]
  (let [args (if params params {})]
    (utf-8-response (parser/render-file template params))))
