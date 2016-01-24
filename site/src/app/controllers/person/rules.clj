(ns app.controllers.person.rules
  (:require [environ.core :refer [env]]
            [app.util.security :refer [user-access admin-access]]))

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
