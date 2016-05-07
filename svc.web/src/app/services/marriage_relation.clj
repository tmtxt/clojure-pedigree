(ns app.services.marriage-relation
  (:require [app.services.util :refer [call-json]]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn detect-partner-role-single [person]
  (call-json :svc-marriage-relation "/detect/partnerRole/single" :get person))

(defn add-relation [husband-node wife-node & [husband-wife-order wife-husband-order]]
  (call-json :svc-marriage-relation "/add/" :post
             {:husband-node-id (:id husband-node)
              :wife-node-id (:id wife-node)
              :husband-wife-order husband-wife-order
              :wife-husband-order wife-husband-order}))
