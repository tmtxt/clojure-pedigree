(ns app.controllers.admin.preface
  (:require [app.views.layout :refer [render render-message]]
            [app.util.main :as util]
            [slingshot.slingshot :refer [try+ throw+]]
            [validateur.validation :as vl]
            [app.models.minor-content :refer [find-content update-content]]
            [config.main :refer [config]]
            [app.logic.preface-content :as preface]))

(defn preface-render [request & [message type]]
  (let [content (preface/get)
        content (if message (assoc content :message message) content)
        content (if type (assoc content :message-type type) content)]
    (render request "admin/preface.html" content)))

(defn preface-process [request]
  (let [content (util/param request "preface-content" "")
        result (preface/update content)]
    (if result
      (render request "admin/preface.html" {:content content
                                            :message "Cập nhật thành công"})
      (preface-render request "Cập nhật không thành công" "error"))))
