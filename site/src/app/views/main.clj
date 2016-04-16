(ns app.views.main
  (:require [selmer.parser :as parser]
            [ring.util.response :refer [content-type response]]
            [compojure.response :refer [Renderable]]
            [app.logic.user :refer [get-user-from-request]]
            [config.main :refer [config]]
            [app.views.version :refer [version]]))

(parser/set-resource-path! (clojure.java.io/resource "templates"))

(def layout-text
  {:homepage "Trang chủ"
   :treepage "Cây gia phả"
   :members "Thành viên"
   :pedigree-tree "Cây gia phả"
   :pedigree-history "Lịch sử dòng họ"
   :contact "Liên hệ"
   :hello "Xin chào"
   :login "Đăng nhập"
   :title "Trần Văn Gia Phả"
   :head-line "Gìn giữ cho muôn đời sau"})

(defn- make-params [request params]
  {:layout layout-text
   :params (if params params {})
   :user (get-user-from-request request)
   :version (str "?version=" version)
   :config config})

(defn render-template [request template-name & [params]]
  (let [params (make-params request params)]
    (-> template-name
        (parser/render-file params)
        (response)
        (content-type "text/html; charset=utf-8"))))
