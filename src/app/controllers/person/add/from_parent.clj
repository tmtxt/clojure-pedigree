(ns app.controllers.person.add.from-parent
  (:require [app.neo4j.main :as neo4j]
            [app.models.person :as person]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.controllers.person.util :as controller-util]
            [app.models.pedigree-relation :as prl]
            [korma.db :as kd]
            [app.util.main :as util]))

(defn process-get-request [request]
  (neo4j/with-transaction
    (let [parent (controller-util/find-person-from-request request "parentId")]
      (if parent
        (let [parent-role (person-util/determine-father-mother-single parent)]
          (render/render-add-page request {:action "add"
                                           :from "parent"
                                           :parent {parent-role parent}}))
        (render/render-add-page request)))))

(defn process-post-request [request]
  (neo4j/with-transaction
    (kd/transaction
     (let [find-fn #(controller-util/find-person-from-request request %)
           father (find-fn :fatherId)
           mother (find-fn :motherId)]
       (if (every? nil? [father mother])
         "nil all"
         (let [person-result (controller-util/create-person-from-request request)
               person-node (person-result :node)
               father-node (person/find-node-by-person-id (:id father))
               mother-node (person/find-node-by-person-id (:id mother))]
           (cond
             (nil? father) (prl/add-child-for-mother mother-node person-node 0)
             (nil? mother) (prl/add-child-for-father father-node person-node 0)
             :else (prl/add-child father-node mother-node person-node 0))
           ))))))
