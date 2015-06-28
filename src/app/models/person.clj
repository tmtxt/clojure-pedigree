(ns app.models.person
  (:require [korma.core :refer :all]
            [korma.db :as kd]
            [app.util.dbUtil :as db-util]
            [app.util.neo4j :as neo-util]
            [app.util.neo4j.command :as ncm]
            [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.labels :as nl]
            [clojurewerkz.neocons.rest.cypher :as cy]
            [clojurewerkz.neocons.rest.transaction :as tx]
            [clojure.tools.logging :as log]
            [config.neo4j :refer [conn]]
            [validateur.validation :as vl]
            [slingshot.slingshot :refer [throw+ try+]]
            [app.models.pedigreeRelation :as prl]
            [app.models.marriageRelation :as mrl]))

(defentity person
  (table :tbl_person)

  (pk :id))

(def pg-validation
  (vl/validation-set
   (vl/presence-of :full_name)))

(def neo4j-validation
  (vl/validation-set
   (vl/presence-of :user_id)
   (vl/validate-by :user_id #(db-util/exists? person {:id %}) :message "User Id not exist")))

(defn add-person-node
  "Add person node into neo4j using the person entity, optionally specify keyword is-root of the system"
  [person-entity & {:keys [is-root]
                    :or {is-root false}}]
  (let [person-node (ncm/create-or-update-node
                     :person
                     {:user_id (person-entity :id)}
                     {:is_root is-root})]
    {:success true
     :person person-entity
     :node person-node}
    ))

(defn add-person
  "Add new person into postgres and neo4j"
  [person-map & {:keys [is-root]
                 :or {is-root false}}]
  (let [errors (pg-validation person-map)]
    (if (empty? errors)
      (let [new-person (insert person (values person-map))]
        (add-person-node new-person :is-root is-root))
      {:success false
       :errors errors})
    ))

(defn create-init-person
  "Create new persons when the app starts if there is no person presented yet"
  []
  (when (db-util/table-empty? person)
    (ncm/with-transaction conn
      (kd/transaction
       (try+
        (let [root-husband (-> {:full_name "Root Husband"} (add-person :is-root true) (:node))
              root-wife    (-> {:full_name "Root Wife"}    (add-person) (:node))

              f2-1-husband (-> {:full_name "F2-1-Husband"} (add-person) (:node))
              f2-1-wife-1  (-> {:full_name "F2-1-Wife-1"}  (add-person) (:node))
              f2-1-wife-2  (-> {:full_name "F2-1-Wife-2"}  (add-person) (:node))
              f2-2-husband (-> {:full_name "F2-2-husband"} (add-person) (:node))
              f2-3-husband (-> {:full_name "F2-3-husband"} (add-person) (:node))
              f2-3-wife    (-> {:full_name "F2-3-wife"}    (add-person) (:node))

              f3-1-wife    (-> {:full_name "F3-1-wife"}    (add-person) (:node))
              f3-1-husband (-> {:full_name "F3-1-husband"} (add-person) (:node))
              f3-2-husband (-> {:full_name "F3-2-Husband"} (add-person) (:node))
              f3-3-husband (-> {:full_name "F3-3-Husband"} (add-person) (:node))
              f3-3-wife    (-> {:full_name "F3-3-Wife"}    (add-person) (:node))]

          ;; marriages
          ;; (mrl/add-marriage root-husband root-wife)
          ;; (mrl/add-marriage f2-1-husband f2-1-wife-1)
          ;; (mrl/add-marriage f2-1-husband f2-1-wife-2)
          ;; (mrl/add-marriage f2-2-husband f2-3-wife)
          ;; (mrl/add-marriage f3-1-husband f3-1-wife)
          ;; (mrl/add-marriage f3-3-husband f3-3-wife)

          ;; ;; pedigree
          ;; (prl/add-child root-husband root-wife f2-1-husband)
          ;; (prl/add-child root-husband root-wife f2-2-husband)
          ;; (prl/add-child root-husband root-wife f2-3-husband)
          ;; (prl/add-child f2-1-husband f2-1-wife-1 f3-1-wife)
          ;; (prl/add-child f2-1-husband f2-1-wife-2 f3-2-husband)
          ;; (prl/add-child f2-2-husband f2-3-wife f3-3-husband)
          )
        (catch Exception ex
          (log/error (.getMessage ex))
          (kd/rollback))
        (catch String err
          (log/error err)
          (kd/rollback))
        (catch Object obj
          (log/error "Unexpected Errors")
          (kd/rollback)))))))

(defn find-node-by-user-id
  "Find the node from neo4j using the input user id"
  [user-id]
  (nn/find-one conn
               (:user-id neo-util/INDEX_NAMES)
               (:user-id neo-util/INDEX_NAMES)
               user-id))

;; (defn tt []
;;   (nst/with-transaction conn
;;     (nst/create-or-update-node :person {:user_id 1} {:age 100})
;;     ))
