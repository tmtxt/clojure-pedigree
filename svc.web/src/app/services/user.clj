(ns app.services.user
  (:require [app.services.util :refer [call call-json]]
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
          :old-password old-password
          :new-password new-password})
   true
   (catch Object _ false)))

(defn empty? []
  (try+
   (-> (call :svc-user "/user/empty" :get {})
       (:data))
   (catch Object _ true)))

(defn add [user role]
  (call-json :svc-user "/user/add" :post {:user user
                                          :user-role
                                          {:role-name role}}))

(defn count "Count total users" []
  (call-json :svc-user "/user/count" :get {}))
