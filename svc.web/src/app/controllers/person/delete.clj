(ns app.controllers.person.delete
  (:require [app.views.main :as view]
            [app.util.main :as util]
            [slingshot.slingshot :refer [try+ throw+]]
            [app.services.person :as svc-person]
            [app.logger.log-trace :as log-trace]))

(defn handle-get-request [request]
  (try+
   (let [;; get person id
         person-id (-> request util/params :personId util/parse-int)
         _ (log-trace/add :info "(handle-get-request)" "Person id" person-id)

         ;; find the person (to verify it exists)
         person       (svc-person/find-by-id person-id)
         {node :node} person
         _ (log-trace/add :info "(handle-get-request)" "Person node id" (:id node))
         _ (log-trace/add :info "(handle-get-request)" "Is root?" (:is-root node))

         ;; not delete if this is root
         _ (when (:is-root node) (throw+ "Không thể xóa cụ tổ"))

         ;; delete the person
         _ (log-trace/add :info "(handle-get-request)" "Is root?" (:is-root node))
         person (svc-person/delete person-id)]

     ;; render message page
     (view/render-message request
                          "Thành viên đã xóa"
                          :type :info
                          :redirect "/" :text "Trang chủ"))

   (catch #(instance? String %) mes (view/render-message request mes :type :error))))
