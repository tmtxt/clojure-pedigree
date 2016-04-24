(ns app.services.pedigree-relation
  (:require [app.services.util :refer [call]]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn detect-parent-role-single [person]
  (try+
   (-> (call :svc-pedigree-relation "/detect/parentRole/single" :get person)
       (:data))
   (catch Object _ nil)))

(defn add-from-father [person-node father-node]
  (try+
   (let [data {:father-node-id (:id father-node)
               :child-node-id (:id person-node)}]
     (-> (call :svc-pedigree-relation "/add/fromFather" :post data)
         (:data)))
   (catch Object _ nil)))

(defn add-from-mother [person-node mother-node]
  (try+
   (let [data {:mother-node-id (:id mother-node)
               :child-node-id (:id person-node)}]
     (-> (call :svc-pedigree-relation "/add/fromMother" :post data)
         (:data)))
   (catch Object _ nil)))

(defn add-from-both [person-node father-node mother-node]
  (try+
   (let [data {:father-node-id (:id father-node)
               :mother-node-id (:id mother-node)
               :child-node-id (:id person-node)}]
     (-> (call :svc-pedigree-relation "/add/fromBoth" :post data)
         (:data)))
   (catch Object _ nil)))
