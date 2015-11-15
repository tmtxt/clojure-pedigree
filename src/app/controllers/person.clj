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
            [app.controllers.person.add :as add-person]
            [app.controllers.person.edit :as edit-person]
            [app.controllers.person.find :as find-person]
            [app.controllers.person.detail :as person-detail]))

(def person-routes
  (context "/person" []
           (GET  "/add/parentId/:parentId"   [] add-person/add-person-from-parent)
           (GET  "/add/partnerId/:partnerId" [] add-person/add-person-from-partner)
           (GET  "/add/childId/:childId"     [] add-person/add-person-from-child)
           (GET  "/add/person"               [] add-person/add-person-from-none)
           (GET  "/find/list/simple"         [] find-person/find-list-simple)
           (POST "/add/process"              [] add-person/add-person-process)
           (GET "/detail/:personId"          [] person-detail/show-detail)
           (GET "/edit/:personId"            [] edit-person/handle-get-request)))

;; (def person-rules [{:pattern #"^/person/add.*"
;;                     :handler admin-access}])

(def person-rules [{:pattern #"^/person/kfjsdljfkl.*"
                    :handler admin-access}])
