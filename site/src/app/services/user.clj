(ns app.services.user
  (:require [app.services.util :refer [call]]))

(defn authenticate [username password]
  (call :svc-user "/user/auth" :post {:username username :password password}))
