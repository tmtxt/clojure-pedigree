(ns app.views.layout
  (:require [selmer.parser :as parser]
            [ring.util.response :refer [content-type response]]
            [compojure.response :refer [Renderable]]
            [app.i18n.main :refer [make-layout-tran]]
            [app.models.user :refer [get-user-from-request]]
            [config.main :refer [config]]
            [app.views.version :refer [version]]))

(parser/set-resource-path! (clojure.java.io/resource "templates"))
(parser/cache-off!)

(defn utf-8-response [html]
  (content-type (response html) "text/html; charset=utf-8"))

(defn render [request template & [params tran]]
  (let [page-tran (if tran tran {})
        page-params (if params params {})
        template-params {:layout (make-layout-tran request)
                         :page page-tran
                         :params page-params
                         :user (get-user-from-request request)
                         :version (str "?version=" version)
                         :config config}]
    (utf-8-response (parser/render-file template template-params))))

(def alert-type {:success "success"
                 :info "info"
                 :warning "warning"
                 :danger "danger"
                 :error "danger"})

;;; render message page
(defn render-message [request message & {:keys [type]
                                 :or {type :info}}]
  (let [alert-class (get alert-type type "info")]
    (render request "layouts/message.html" {:message message
                                            :alert-class alert-class})))
