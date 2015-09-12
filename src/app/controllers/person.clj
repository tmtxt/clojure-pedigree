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
            [korma.core :as kc]))

(defn- find-person-from-request [request param-name]
  (-> request
      (util/param param-name)
      (util/parse-int)
      (person/find-by-person-id)))

(defn add-child [request]
  ;; check parent exists
  (neo4j/with-transaction
    (let [parent (find-person-from-request request "parentId")
          t (make-t-with-scope request :page-add-child)]
      (if parent
        ;; get all the marriage partner of this parent
        (let [partners (person/find-partners (:id parent))
              page-tran (make-page-tran request :page-add-child)
              [parent-title partner-title] (person-util/title-as-parent parent)
              parent-title (t parent-title)
              partner-title (t partner-title)]
          (layout/render request
                         "person/add_child.html"
                         {:parent parent
                          :partners partners
                          :parent-title parent-title
                          :partner-title partner-title}
                         page-tran))

        ;; render error page
        (error/render (t :error-parent-not-found))))))

(defn- add-child-for-single-parent [child-node parent child-order t]
  (let [parent-role (person-util/determine-father-mother-single parent)
        parent-node (person/find-node-by-user-id (:id parent))
        add-func (if (= parent-role :father) prl/add-child-for-father prl/add-child-for-mother)
        result (add-func parent-node child-node child-order)]
    (if result
      (t :success-add-child)
      (t :error-add-child)
      )))

(defn- add-child-for-parents [child-node parent partner child-order t]
  (let [{father :father mother :mother} (person-util/determine-father-mother parent partner)
        father-node (person/find-node-by-user-id (:id father))
        mother-node (person/find-node-by-user-id (:id mother))
        result (prl/add-child father-node mother-node child-node child-order)]
    (if result
      (t :success-add-child)
      (t :error-add-child)
      )))

(defn add-child-process [request]
  ;; check parent exists
  (neo4j/with-transaction
    (let [parent (find-person-from-request request "parent_id")
          partner (find-person-from-request request "partner_id")
          child-name (util/param request "child_name")
          child-order (-> request
                          (util/param "child_order" 0)
                          (util/parse-int 0))
          t (make-t-with-scope request :page-add-child)]
      (cond
        (not parent) (error/render (t :error-parent-not-found))
        :else
        (neo4j/with-transaction conn
          (kd/transaction
           (let [child-node (-> {:full_name child-name}
                                (person/add-person)
                                (:node))]
             (if partner
               (add-child-for-parents child-node parent partner child-order t)
               (add-child-for-single-parent child-node parent child-order t)))
           ))))))

(defn add-parent [request]
  "hello")

(defn add-partner [request]
  "hello")

(def default-opts
  {:parent {}
   :partner {}
   :child {}
   :from nil
   :action "add"})

(defn add-person-render [request & [opts]]
  (let [opts (if opts opts default-opts)
        {parent :parent
         partner :partner
         child :child
         from :from
         action :action} opts
        statuses (-> request person-util/status-display json/write-str)
        genders  (-> request person-util/gender-display json/write-str)
        parent   (-> parent person-util/filter-parent-keys json/write-str)
        child    (-> child person-util/filter-person-keys json/write-str)
        partner  (-> partner person-util/filter-partner-keys json/write-str)]
    (layout/render request
                   "person/edit_detail2.html"
                   {:from from
                    :parent parent
                    :partner partner
                    :child child
                    :statuses statuses
                    :genders genders
                    :action action})))

(defn add-person-get [request]
  (neo4j/with-transaction
    (add-person-render request)))

(defn add-person-from-parent [request]
  (neo4j/with-transaction
    (let [parent (find-person-from-request request "parentId")]
      (if parent
        (let [parent-role (person-util/determine-father-mother-single parent)]
          (add-person-render request {:action "add"
                                      :from "parent"
                                      :parent {parent-role parent}}))
        (add-person-render request)))))

(defn add-person-from-partner [request]
  (neo4j/with-transaction
    (let [partner (find-person-from-request request "partnerId")]
      (if partner
        (let [partner-role (person-util/determine-partner-role-single partner)]
          (add-person-render request {:action "add"
                                      :from "partner"
                                      :partner {partner-role partner}}))
        (add-person-render request))
      )))

(defn add-person-from-child [request]
  (neo4j/with-transaction
    (let [child (find-person-from-request request "childId")]
      (if (and child (-> child :id person/enough-parent? not))
        (add-person-render request {:action "add"
                                    :from "child"
                                    :child child})
        (add-person-render request))
      )))

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

(defn add-person-process [request]
  (clojure.pprint/pprint (get request :params))
  (neo4j/with-transaction
    ;; (clojure.pprint/pprint (util/params request))
    nil
    ))

(def person-routes
  (context "/person" []
           (GET "/addChild/parentId/:parentId" [] add-child)
           (POST "/addChild" [] add-child-process)
           (GET "/addParent/childId/:childId" [] add-parent)
           (GET "/addPartner/partnerId/:partnerId" [] add-partner)
           (GET "/add/parentId/:parentId" [] add-person-from-parent)
           (GET "/add/partnerId/:partnerId" [] add-person-from-partner)
           (GET "/add/childId/:childId" [] add-person-from-child)
           (GET "/addPerson" [] add-person-get)
           (GET "/find" [] find-person)
           (POST "/add/process" [] add-person-process)
           ))

;; (def person-rules [{:pattern #"^/person/add.*"
;;                     :handler admin-access}])

(def person-rules [{:pattern #"^/person/them.*"
                    :handler admin-access}])
