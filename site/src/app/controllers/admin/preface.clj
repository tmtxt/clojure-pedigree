(ns app.controllers.admin.preface
  (:require [app.views.layout :refer [render render-message]]
            [app.util.main :as util]
            [slingshot.slingshot :refer [try+ throw+]]
            [validateur.validation :as vl]
            [app.models.minor-content :refer [find-content update-content]]
            [config.main :refer [config]]))

(def preface-key (:preface-key config))

(defn preface-render [request & [message type]]
  (let [content (find-content preface-key)
        content (if message (assoc content :message message) content)
        content (if type (assoc content :message-type type) content)]
    (render request "admin/preface.html" content)))

(defn preface-process [request]
  (let [preface (util/param request "preface-content" "")
        content {:content preface}
        result (update-content preface-key content)]
    (if (= result 1)
      (render request "admin/preface.html" {:content preface
                                            :message "Cập nhật thành công"})
      (preface-render request "Cập nhật không thành công" "error"))))
