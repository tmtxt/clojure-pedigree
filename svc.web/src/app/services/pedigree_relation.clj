(ns app.services.pedigree-relation
  (:require [app.services.util :refer [call call-json]]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn detect-parent-role-single [person]
  (call-json :svc-pedigree-relation "/detect/parentRole/single" :get person))

(defn add-from-father [person-node father-node]
  (call-json :svc-pedigree-relation "/add/fromFather"
             :post {:father-node-id (:id father-node)
                    :child-node-id (:id person-node)}))

(defn add-from-mother [person-node mother-node]
  (call-json :svc-pedigree-relation "/add/fromMother"
             :post {:mother-node-id (:id mother-node)
                    :child-node-id (:id person-node)}))

(defn count-parents [person-node]
  (call-json :svc-pedigree-relation "/count/parents"
             :get {:person-node-id (:id person-node)}))
