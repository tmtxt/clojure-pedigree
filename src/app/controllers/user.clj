(ns app.controllers.user
  (:require [compojure.core :refer :all]
            [buddy.auth.accessrules :refer (success error)]
            [buddy.auth :refer [authenticated?]]))

(defn authenticated-user [request]
  (if (authenticated? request)
    true
    (error "not authenticated")))

(def user-rules [{:pattern #"^/user/.*"
                  :handler authenticated-user}])

(defn view-profile [request]
  "Hello")

(def user-routes
  (context
   "/user" []
   (GET "/profile" [] view-profile)))


















