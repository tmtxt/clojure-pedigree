(ns app.controllers.person.add.from-parent
  (:require [app.models.person :as person]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.controllers.person.util :refer [find-person-from-request create-person-from-request]]
            [app.models.pedigree-relation :as prl]
            [korma.db :refer [transaction rollback]]
            [app.util.main :as util]
            [slingshot.slingshot :refer [try+ throw+]]
            [app.views.layout :refer [render-message]]
            [ring.util.response :refer [redirect]]))

(defn- render-page
  "Render add page with the parent entity"
  [request parent]
  (let [parent-role (person-util/determine-father-mother-single parent)]
    (render/render-add-page request {:action "add"
                                     :from "parent"
                                     :parent {parent-role parent}})))

(defn process-get-request [request]
  (if-let [parent (find-person-from-request request "parentId")]
    (render-page request parent)
    (render/render-add-page request)))

(defn- find-parents
  "Find parents entities from request, return [father mother]"
  [request]
  (let [find-fn #(find-person-from-request request %)
        father (find-fn :fatherId)
        mother (find-fn :motherId)]
    [father mother]))

(defn- validate-parents
  "Validate parent entities"
  [parents]
  (when (every? nil? parents) (throw+ "nil all")))

(defn- render-error
  "Render error page after add"
  [request]
  (rollback)
  (render-message request "Có lỗi xảy ra" :type :error))

(defn process-post-request [request]
  (transaction
   (try+
    (let [[father mother] (find-parents request)
          _ (validate-parents [father mother])
          person (-> request create-person-from-request :entity)]
      (cond
        (nil? father) (prl/add-child-for-mother mother person 0)
        (nil? mother) (prl/add-child-for-father father person 0)
        :else (prl/add-child father mother person 0))
      (redirect (str "/person/detail/" (:id person))))
    (catch Object _ (render-error request)))))
