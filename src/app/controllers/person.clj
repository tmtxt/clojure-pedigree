(ns app.controllers.person
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [app.views.error :as error]
            [noir.session :as session]
            [app.util.main :as util]
            [clojure.data.json :as json]
            [ring.util.response :refer [response]]
            [app.util.person :as person-util]
            [app.models.person :as person]
            [app.neo4j.main :as neo4j]
            [config.neo4j :refer [conn]]
            [app.models.pedigreeRelation :as prl]
            [app.util.security :refer [user-access admin-access]]
            [korma.db :as kd]
            [app.i18n.main :refer [make-t-with-scope make-page-tran]]
            [korma.core :as kc]
            [app.controllers.person.add :as add-person]))

(defn- find-person-from-request [request param-name]
  (-> request
      (util/param param-name)
      (util/parse-int)
      (person/find-by-person-id)))

(defn find-person [request]
  (neo4j/with-transaction
    (let [{parent-id :parentId
           term :term
           parent-role :parentRole} (util/params request)]
      (cond
        ;; TODO update this later
        (and parent-id term)
        (let [person-list (-> term person/find-by-name person-util/filter-persons-keys)]
          (response person-list))

        (and parent-role term)
        (let [person-list (-> term person/find-by-name person-util/filter-persons-keys)]
          (response person-list))

        parent-role
        (let [role-genders (person-util/parent-role-genders parent-role)
              person-list (-> role-genders person/find-by-genders person-util/filter-persons-keys)]
          (response person-list))

        parent-id
        (let [partners (-> parent-id person/find-partners person-util/filter-persons-keys)]
          (response partners))

        term
        (let [all (-> term person/find-by-name person-util/filter-persons-keys)]
          (response all))

        :else
        (response [])
        )))
  )

(defn add-from-parent-process [request]
  "parent"
  )

(defn add-from-partner-process [request]
  "partner")

(defn add-from-child-process [request]
  "child")

(defn add-from-none-process [request]
  "none")

(defn add-person-process [request]
  (neo4j/with-transaction
    (let [params (util/params request)
          {from-person :fromPerson} params]
      (case from-person
        "parent" (add-from-parent-process request)
        "child" (add-from-child-process request)
        "partner" (add-from-partner-process request)
        (add-from-none-process request))
      )))

(def person-routes
  (context "/person" []
           (GET "/add/parentId/:parentId" [] add-person/add-person-from-parent)
           (GET "/add/partnerId/:partnerId" [] add-person/add-person-from-partner)
           (GET "/add/childId/:childId" [] add-person/add-person-from-child)
           (GET "/add/person" [] add-person/add-person-from-none)
           (GET "/find" [] find-person)
           (POST "/add/process" [] add-person-process)))

;; (def person-rules [{:pattern #"^/person/add.*"
;;                     :handler admin-access}])

(def person-rules [{:pattern #"^/person/them.*"
                    :handler admin-access}])
