(ns app.controllers.user
  (:require [compojure.core :refer :all]
            [app.util.security :refer [user-access]]))

(def user-rules [{:pattern #"^/user/.*"
                  :handler user-access}])

(defn view-profile [request]
  "Hello")

(def user-routes
  (context
   "/user" []
   (GET "/profile" [] view-profile)))


















