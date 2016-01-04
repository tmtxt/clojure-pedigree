(ns app.controllers.person.add.from-parent
  (:require [app.models.person :as person]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.controllers.person.util :as controller-util]
            [app.models.pedigree-relation :as prl]
            [korma.db :as kd]
            [app.util.main :as util]))

(defn process-get-request [request]
  (let [parent (controller-util/find-person-from-request request "parentId")]
    (if parent
      (let [parent-role (person-util/determine-father-mother-single parent)]
        (render/render-add-page request {:action "add"
                                         :from "parent"
                                         :parent {parent-role parent}}))
      (render/render-add-page request))))

(defn process-post-request [request]
  (kd/transaction
   (let [find-fn #(controller-util/find-person-from-request request %)
         father (find-fn :fatherId)
         mother (find-fn :motherId)]
     (if (every? nil? [father mother])
       "nil all"
       (let [person-result (controller-util/create-person-from-request request)
             person-entity (person-result :entity)]
         (cond
           (nil? father) (prl/add-child-for-mother mother person-entity 0)
           (nil? mother) (prl/add-child-for-father father person-entity 0)
           :else (prl/add-child father mother person-entity 0))
         )))))
