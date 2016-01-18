(ns app.controllers.admin.tree-description
  (:require [app.views.layout :refer [render render-message]]
            [app.util.main :as util]
            [slingshot.slingshot :refer [try+ throw+]]
            [validateur.validation :as vl]
            [app.models.minor-content :refer [find-content update-content]]
            [config.main :refer [config]]))

(def tree-description-key (:tree-description-key config))

(defn get-request [request & [message type]]
  (let [content (find-content tree-description-key)
        content (if message (assoc content :message message) content)
        content (if type (assoc content :message-type type) content)]
    (render request "admin/tree_description.html" content)))

(defn post-request [request]
  (let [desc (util/param request "desc-content" "")
        content {:content desc}
        result (update-content tree-description-key content)]
    (if (= result 1)
      (render request "admin/tree_description.html" {:content desc
                                                     :message "Cập nhật thành công"})
      (get-request request "Cập nhật không thành công" "error"))))
