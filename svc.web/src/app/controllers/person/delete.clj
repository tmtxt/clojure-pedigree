(ns app.controllers.person.delete
  (:require [korma.db :as kd]
            [app.util.person :as person-util]
            [app.views.layout :as layout]
            [app.util.main :as util]
            [clojure.data.json :as json]
            [app.controllers.person.util :as controller-util]
            [app.models.person :as person-model]
            [app.util.pg :as db-util]
            [clj-time.format :as f]
            [clj-time.coerce :as c]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn handle-get-request [request]
  (kd/transaction
   (try+
    (let [params (util/params request)
          id (-> params :personId util/parse-int)
          _ (if (nil? id) (throw+ "id is null"))
          person (person-model/find-person-by-id
                  id :include-node true)
          person-entity (:entity person)
          _ (if (nil? person-entity) (throw+ "person not found"))
          person-node (:node person)
          _ (if (:is-root person-node) (throw+ "cannot delete root person"))]
      (person-model/delete-person id)
      (layout/render-message request "Thành viên đã xóa" :type :info :redirect "/" :text "Trang chủ"))
    (catch #(instance? String %) res (layout/render-message request res :type :error)))))