(ns app.services.pedigree-relation
  (:require [app.services.util :refer [call]]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn detect-parent-role-single [person]
  (try+
   (-> (call :svc-pedigree-relation "/detect/parentRole/single" :get person)
       (:data))
   (catch Object _ nil)))
