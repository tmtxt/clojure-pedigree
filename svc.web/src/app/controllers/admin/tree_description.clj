(ns app.controllers.admin.tree-description
  (:require [app.views.main :as view]
            [app.util.main :as util]
            [slingshot.slingshot :refer [try+]]
            [app.helper.minor-content :as minor-content]))

(defn get-request [request & [message type]]
  (let [content (minor-content/get-tree-description)
        content (if message (assoc content :message message) content)
        content (if type (assoc content :message-type type) content)]
    (view/render-template request "admin/tree_description.html" content)))

(defn post-request [request]
  (try+
   (let [desc (util/param request "desc-content" "")
         result (minor-content/update-tree-description desc)]
     (view/render-template request "admin/tree_description.html"
                           {:content desc
                            :message "Cập nhật thành công"}))
   (catch Object _ (get-request request "Cập nhật không thành công" "error"))))
