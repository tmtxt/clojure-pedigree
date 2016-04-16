(ns app.services.user
  (:require [app.services.util :refer [call]]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn authenticate [username password]
  (try+
   (call :svc-user "/user/auth" :post {:username username :password password})
   true
   (catch Object _ false)))

(defn find-user [username]
  (try+
   (-> (call :svc-user "/user/find" :get {:username username})
       (get-in [:data :user]))
   (catch Object _ nil)))
