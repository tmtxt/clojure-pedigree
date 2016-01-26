(ns app.controllers.person.add.from-parent
  (:require [app.models.person :as person]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.controllers.person.util :refer [find-person-from-request create-person-from-request]]
            [app.models.pedigree-relation :as prl]
            [korma.db :refer [transaction rollback]]
            [app.util.main :as util]
            [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [redirect]]
            [app.controllers.person.display :refer [json-friendlify json-friendlify-all]]
            [app.views.layout :refer [render-message]]
            [app.controllers.pedigree-relation.role :refer [father-or-mother?]]
            [app.models.marriage-relation :refer [find-partners]]))

(defn process-get-request [request]
  (if-let [parent (-> request util/params :parentId
                      util/parse-int person/find-by-id :entity)]
    (let [role (father-or-mother? parent)
          parent-partners (-> parent find-partners json-friendlify-all)
          parent (json-friendlify parent)]
      (render/render-add-page request {:action "add"
                                       :from "parent"
                                       :parent {role parent}
                                       :parent-partners parent-partners}))
    (render-message request "Có lỗi xảy ra" :type :error)))

(defn- find-parents
  "Find parents entities from request, return [father mother]"
  [request]
  (let [params (util/params request)
        find-fn #(-> params % util/parse-int person/find-by-id :entity)
        father (find-fn :fatherId)
        mother (find-fn :motherId)]
    [father mother]))

(defn- validate-parents
  "Validate parent entities"
  [parents]
  (when (every? nil? parents) (throw+ "nil all")))

(defn process-post-request [request]
  (transaction
   (try+
    (let [[father mother] (find-parents request)
          _ (validate-parents [father mother])
          person (-> request create-person-from-request :entity)]
      (cond
        (nil? father) (prl/add-child-for-mother mother person)
        (nil? mother) (prl/add-child-for-father father person)
        :else (prl/add-child father mother person))
      (redirect (str "/person/detail/" (:id person))))
    (catch Object res (render/render-error request)))))
