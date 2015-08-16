(ns app.views.layout
  (:require [selmer.parser :as parser]
            [ring.util.response :refer [content-type response]]
            [compojure.response :refer [Renderable]]
            [app.i18n.main :refer [make-layout-tran]]
            [app.models.user :refer [get-user-from-request]]
            [app.views.version :refer [version]]))

(parser/set-resource-path! (clojure.java.io/resource "templates"))
(parser/cache-off!)

(defn utf-8-response [html]
  (content-type (response html) "text/html; charset=utf-8"))

(defn render [request template & [params]]
  (let [args (if params params {})
        template-params {:layout (make-layout-tran request)
                         :page params
                         :user (get-user-from-request request)
                         :version (str "?version=" version)}]
    (utf-8-response (parser/render-file template template-params))))
