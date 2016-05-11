(ns app.controllers.admin.preface
  (:require [app.views.main :as view]
            [app.util.main :as util]
            [app.logic.preface-content :as preface]))

(defn preface-render "Process get request" [request & [message type]]
  (let [content (preface/get)
        content (if message (assoc content :message message) content)
        content (if type (assoc content :message-type type) content)]
    (view/render-template request "admin/preface.html" content)))

(defn preface-process "Process post request" [request]
  (let [content (util/param request "preface-content" "")
        result (preface/update content)]
    (if result
      (view/render-template request "admin/preface.html" {:content content
                                            :message "Cập nhật thành công"})
      (preface-render request "Cập nhật không thành công" "error"))))
