(ns app.data.init
  (:require [app.models.user :as user-model]
            [app.models.person :as person-model]
            [app.util.dbUtil :as db-util]
            [app.util.neo4j.command :as ncm]
            [korma.db :as kd]
            [app.models.marriageRelation :as mrl]
            [app.models.pedigreeRelation :as prl]
            [config.neo4j :refer [conn]]))

(defn create-init-user []
  (when (db-util/table-empty? user-model/user)
    (user-model/add-user {:username "admin"
                          :full_name "Admin"
                          :email "admin@example.com"
                          :password "admin"}
                         :admin)))

(defn create-init-person
  "Create new persons when the app starts if there is no person presented yet"
  []
  (when (db-util/table-empty? person-model/person)
    (ncm/with-transaction conn
      (kd/transaction
       (let [root-husband (-> {:full_name "Root Husband"} (person-model/add-person :is-root true) (:node))
             root-wife    (-> {:full_name "Root Wife"}    (person-model/add-person) (:node))

             f2-1-husband (-> {:full_name "F2-1-Husband"} (person-model/add-person) (:node))
             f2-1-wife-1  (-> {:full_name "F2-1-Wife-1"}  (person-model/add-person) (:node))
             f2-1-wife-2  (-> {:full_name "F2-1-Wife-2"}  (person-model/add-person) (:node))
             f2-2-husband (-> {:full_name "F2-2-husband"} (person-model/add-person) (:node))
             f2-3-husband (-> {:full_name "F2-3-husband"} (person-model/add-person) (:node))
             f2-3-wife    (-> {:full_name "F2-3-wife"}    (person-model/add-person) (:node))

             f3-1-wife    (-> {:full_name "F3-1-wife"}    (person-model/add-person) (:node))
             f3-1-husband (-> {:full_name "F3-1-husband"} (person-model/add-person) (:node))
             f3-2-husband (-> {:full_name "F3-2-Husband"} (person-model/add-person) (:node))
             f3-3-husband (-> {:full_name "F3-3-Husband"} (person-model/add-person) (:node))
             f3-3-wife    (-> {:full_name "F3-3-Wife"}    (person-model/add-person) (:node))]

         ;; marriages
         (mrl/add-marriage root-husband root-wife)
         (mrl/add-marriage f2-1-husband f2-1-wife-1 :husband-order 0)
         (mrl/add-marriage f2-1-husband f2-1-wife-2 :husband-order 1)
         (mrl/add-marriage f2-2-husband f2-3-wife)
         (mrl/add-marriage f3-1-husband f3-1-wife)
         (mrl/add-marriage f3-3-husband f3-3-wife)

         ;; pedigree
         (prl/add-child root-husband root-wife f2-2-husband 1)
         (prl/add-child root-husband root-wife f2-1-husband 0)
         (prl/add-child root-husband root-wife f2-3-husband 2)
         (prl/add-child f2-1-husband f2-1-wife-1 f3-1-wife 0)
         (prl/add-child f2-1-husband f2-1-wife-2 f3-2-husband 0)
         (prl/add-child f2-2-husband f2-3-wife f3-3-husband 0))))))

(defn create-init-data []
  (create-init-user)
  (create-init-person))
