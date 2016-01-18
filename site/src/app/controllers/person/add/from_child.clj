(ns app.controllers.person.add.from-child
  (:require [app.neo4j.main :as neo4j]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.models.person :as person]
            [korma.db :refer [transaction]]
            [app.controllers.person.util :refer [find-person-from-request create-person-from-request]]
            [app.models.pedigree-relation :as prl]
            [app.views.layout :refer [render-message]]
            [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [redirect]]))

(defn process-get-request [request]
  (let [child (find-person-from-request request "childId")]
    (cond
      (not child)
      (render-message request "Có lỗi xảy ra" :type :error)

      (-> child person/enough-parents?)
      (render-message request "Thành viên này đã có đủ cha mẹ" :type :error)

      :else
      (render/render-add-page request {:action "add"
                                       :from "child"
                                       :child child}))))

(defn- find-child
  "Find child entity from the request"
  [request]
  (if-let [child (find-person-from-request request :childId)]
    child
    (throw+ "child not found")))

(defn process-post-request [request]
  (transaction
   (try+
    (let [child (find-child request)
          person (-> request create-person-from-request :entity)
          parent-role (person-util/determine-father-mother-single person)]
      (if (= parent-role :father)
        (prl/add-child-for-father person child)
        (prl/add-child-for-mother person child))
      (->> (:id person) (str "/person/detail/") redirect))
    (catch Object _ (render/render-error request)))))
