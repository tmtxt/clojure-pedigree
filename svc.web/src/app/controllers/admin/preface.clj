(ns app.controllers.admin.preface
  (:require [app.views.main :as view]
            [app.util.main :as util]
            [slingshot.slingshot :refer [try+]]
            [app.helper.minor-content :as minor-content]))

(defn preface-render "Process get request" [request & [message type]]
  (let [content (minor-content/get-preface)
        content (if message (assoc content :message message) content)
        content (if type (assoc content :message-type type) content)]
    (view/render-template request "admin/preface.html" content)))

(defn preface-process "Process post request" [request]
  (try+
   (let [content (util/param request "preface-content" "")
         result (minor-content/update-preface content)]
     (view/render-template request
                           "admin/preface.html"
                           {:content content
                            :message "Cập nhật thành công"}))
   (catch Object _ (preface-render request "Cập nhật không thành công" "error"))))
