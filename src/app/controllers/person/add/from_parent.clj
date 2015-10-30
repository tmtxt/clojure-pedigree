(ns app.controllers.person.add.from-parent
  (:require [app.neo4j.main :as neo4j]
            [app.models.person :as person]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.controllers.person.util :as controller-util]
            [app.models.marriageRelation :as mrl]
            [app.models.pedigreeRelation :as prl]
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

(defn params-to-person-data
  [{full-name :name
    birth-date :birthdate
    status :status
    gender :gender
    death-date :deathdate
    phone :phone
    address :address}]

  {:full_name full-name
   :birth_date birth-date
   ;; :death_date death-date
   :alive_status status
   :address address
   :gender gender
   :phone_no phone})

(defn create-person-from-request [request]
  (let [params (util/params request)
        person-data (params-to-person-data params)]
    (person/add-person person-data)))

(defn process-post-request [request]
  (neo4j/with-transaction
    (kd/transaction
     (let [find-fn #(controller-util/find-person-from-request request %)
           father (find-fn :fatherId)
           mother (find-fn :motherId)]
       (if (every? nil? [father mother])
         "nil all"
         (let [person-result (create-person-from-request request)
               person-node (person-result :node)
               father-node (person/find-node-by-person-id (:id father))
               mother-node (person/find-node-by-person-id (:id mother))]
           (prl/add-child father-node mother-node person-node 0)
           ))))))
