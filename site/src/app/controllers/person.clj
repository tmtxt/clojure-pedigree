(ns app.controllers.person
  (:require [compojure.core :refer :all]
            [environ.core :refer [env]]
            [app.util.security :refer [user-access admin-access]]
            [app.controllers.person.add :as add-person]
            [app.controllers.person.edit :as edit-person]
            [app.controllers.person.delete :as delete-person]
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
           (GET "/detail/:personId"          [] person-detail/process-get-request)
           (GET "/edit/:personId"            [] edit-person/handle-get-request)
           (POST "/editProcess"              [] edit-person/handle-post-request)
           (GET "/delete/:personId"          [] delete-person/handle-get-request)))

(def person-rules
  (if (-> :profile env (= "dev"))
    [{:pattern #"^/person/sfkjdslkjfldjfs.*"
      :handler admin-access}]
    [{:pattern #"^/person/add.*"
      :handler admin-access}
     {:pattern #"^/person/edit.*"
      :handler admin-access}
     {:pattern #"^/person/delete.*"
      :handler admin-access}]))
