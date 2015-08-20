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
  (let [parent (find-person-from-request request "parentId")]
    (if parent
      ;; get all the marriage partner of this parent
      (let [partners (person/find-partners (:id parent))
            t (make-t-with-scope request :person-display)
            [parent-title partner-title] (person-util/title-as-parent parent)
            parent-title (t parent-title)
            partner-title (t partner-title)
            ]
        (layout/render request
                       "person/add_child.html"
                       {:parent parent
                        :partners partners
                        :parent-title parent-title
                        :partner-title partner-title}))

      ;; render error page
      (error/render "parent not found"))))

(defn add-child-process [request]
  ;; check parent exists
  (let [parent (find-parent-from-request request "parent_id")
        partner (find-parent-from-request request "partner_id")
        child-name (util/param request "child_name")
        child-order (-> request
                        (util/param "child_order" 0)
                        (util/parse-int 0))]
    (cond
      (not parent) "parent not found"
      (not partner) "partner not found"
      :else
      (ncm/with-transaction conn
        (kd/transaction
         (let [{father :father mother :mother} (person-util/determine-father-mother parent partner)
               child-node (-> {:full_name child-name}
                              (person/add-person)
                              (:node))
               father-node (person/find-node-by-user-id (:id father))
               mother-node (person/find-node-by-user-id (:id mother))]
           (prl/add-child father-node mother-node child-node child-order)
           ))))))

(defn add-parent [request]
  "hello")

(defn add-partner [request]
  "hello")

(def person-routes
  (context "/person" []
           (GET "/addChild/parentId/:parentId" [] add-child)
           (POST "/addChild" [] add-child-process)
           (GET "/addParent/childId/:childId" [] add-parent)
           (GET "/addPartner/partnerId/:partnerId" [] add-partner)))
