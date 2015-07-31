(ns app.views.layout
  (:require [selmer.parser :as parser]
            [ring.util.response :refer [content-type response]]
            [compojure.response :refer [Renderable]]
            [app.i18n.main :refer [make-layout-tran]]))

(parser/set-resource-path! (clojure.java.io/resource "templates"))
(parser/cache-off!)

(defn utf-8-response [html]
  (content-type (response html) "text/html; charset=utf-8"))

(defn render [request template & [params]]
  (let [args (if params params {})
        layout-tran (make-layout-tran request)
        template-params (merge args layout-tran)]
    (utf-8-response (parser/render-file template template-params))))
