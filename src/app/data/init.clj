(ns app.data.init
  (:require [app.models.user :as user-model]
            [app.models.person :as person-model]
            [app.util.pg :as db-util]
            [app.neo4j.main :as neo4j]
            [korma.db :as kd]
            [app.models.marriage-relation :as mrl]
            [app.models.pedigree-relation :as prl]
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
    (neo4j/with-transaction
      (kd/transaction
       (let [root-husband (-> {:full-name "Root Husband"
                               :picture "/assets/img/a.jpg"}
                              (person-model/add-person :is-root true) (:node))
             root-wife    (-> {:full-name "Root Wife"
                               :picture "/assets/img/b.jpg"}
                              (person-model/add-person) (:node))

             f2-1-husband (-> {:full-name "F2-1-Husband"
                               :picture "/assets/img/c.jpg"}
                              (person-model/add-person) (:node))
             f2-1-wife-1  (-> {:full-name "F2-1-Wife-1"
                               :picture "/assets/img/d.jpg"}
                              (person-model/add-person) (:node))
             f2-1-wife-2  (-> {:full-name "F2-1-Wife-2"
                               :picture "/assets/img/e.jpg"}
                              (person-model/add-person) (:node))
             f2-2-husband (-> {:full-name "F2-2-husband"
                               :picture "/assets/img/g.jpg"}
                              (person-model/add-person) (:node))
             f2-3-husband (-> {:full-name "F2-3-husband"
                               :picture "/assets/img/h.jpg"}
                              (person-model/add-person) (:node))
             f2-3-wife    (-> {:full-name "F2-3-wife"
                               :picture "/assets/img/i.jpg"}
                              (person-model/add-person) (:node))

             f3-1-wife    (-> {:full-name "F3-1-wife"
                               :picture "/assets/img/j.jpg"}
                              (person-model/add-person) (:node))
             f3-1-husband (-> {:full-name "F3-1-husband"
                               :picture "/assets/img/k.jpg"}
                              (person-model/add-person) (:node))
             f3-2-husband (-> {:full-name "F3-2-Husband"
                               :picture "/assets/img/l.jpg"}
                              (person-model/add-person) (:node))
             f3-3-husband (-> {:full-name "F3-3-Husband"
                               :picture "/assets/img/m.jpg"}
                              (person-model/add-person) (:node))
             f3-3-wife    (-> {:full-name "F3-3-Wife"
                               :picture "/assets/img/n.jpg"}
                              (person-model/add-person) (:node))

             f4-1-husband (-> {:full-name "F4-1-Wife"
                               :picture "/assets/img/o.jpg"}
                              (person-model/add-person) (:node))
             ]

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
         (prl/add-child f2-2-husband f2-3-wife f3-3-husband 0)
         (prl/add-child f3-1-husband f3-1-wife f4-1-husband 0))))))

(defn create-init-data []
  (create-init-user)
  (create-init-person))
