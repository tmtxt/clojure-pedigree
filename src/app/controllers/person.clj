(ns app.controllers.person
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [app.views.error :as error]
            [noir.session :as session]
            [app.util.main :as util]
            [app.util.person :as person-util]
            [app.models.person :as person]
            [app.util.neo4j.command :as ncm]
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

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; add child
(defn add-child [request]
  ;; check parent exists
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
      (error/render (t :error-parent-not-found)))))

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
      (ncm/with-transaction conn
        (kd/transaction
         (let [child-node (-> {:full_name child-name}
                              (person/add-person)
                              (:node))]
           (if partner
             (add-child-for-parents child-node parent partner child-order t)
             (add-child-for-single-parent child-node parent child-order t)))
         )))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; add parent
(defn add-parent [request]
  ;; check child exist
  (let [child (find-person-from-request request "childId")
        t (make-t-with-scope request :page-add-parent)]
    (if child
      (if (person/enough-parent? (:id child))
        (error/render (t :error-enough-parent))
        (let [page-tran (make-page-tran request :page-add-parent)]
          (layout/render request
                         "person/add_parent.html"
                         {}
                         page-tran)
          ))
      (error/render (t :error-child-not-found))
      )))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; add partner
(defn add-partner [request]
  "hello")

(def person-routes
  (context "/person" []
           (GET "/addChild/parentId/:parentId" [] add-child)
           (POST "/addChild" [] add-child-process)
           (GET "/addParent/childId/:childId" [] add-parent)
           (GET "/addPartner/partnerId/:partnerId" [] add-partner)))

(def person-rules [{:pattern #"^/person/add.*"
                    :handler admin-access}])
