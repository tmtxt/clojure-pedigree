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
       (get-in [:data]))
   (catch Object _ nil)))

(defn change-password [username old-password new-password]
  (try+
   (call :svc-user "/user/changePassword" :post
         {:username username
          :oldPassword old-password
          :newPassword new-password})
   true
   (catch Object _ false)))
