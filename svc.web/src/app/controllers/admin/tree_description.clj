(ns app.controllers.admin.tree-description
  (:require [app.views.main :as view]
            [app.util.main :as util]
            [app.logic.tree-desc-content :as tree-desc]))

(defn get-request [request & [message type]]
  (let [content (tree-desc/get)
        content (if message (assoc content :message message) content)
        content (if type (assoc content :message-type type) content)]
    (view/render-template request "admin/tree_description.html" content)))

(defn post-request [request]
  (let [desc (util/param request "desc-content" "")
        result (tree-desc/update desc)]
    (if result
      (view/render-template request "admin/tree_description.html"
                            {:content desc
                             :message "Cập nhật thành công"})
      (get-request request "Cập nhật không thành công" "error"))))
