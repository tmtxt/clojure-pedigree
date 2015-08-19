(ns app.controllers.person
  (:require [compojure.core :refer :all]
            [app.views.layout :as layout]
            [app.views.error :as error]
            [noir.session :as session]
            [app.util.main :as util]
            [app.util.person :as person-util]
            [app.models.person :as person]
            [app.i18n.main :refer [make-t-with-scope make-page-tran]]
            [korma.core :as kc]))

(defn add-child [request]
  ;; check parent exists
  (let [parent (-> request
                   (util/param "parentId")
                   (util/parse-int)
                   (person/find-by-person-id))]
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

(defn add-parent [request]
  "hello")

(defn add-partner [request]
  "hello")

(def person-routes
  (context "/person" []
           (GET "/addChild/parentId/:parentId" [] add-child)
           (GET "/addParent/childId/:childId" [] add-parent)
           (GET "/addPartner/partnerId/:partnerId" [] add-partner)))
