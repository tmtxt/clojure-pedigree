(ns app.logic.add-person
  (:require [app.services.person :as svc-person]
            [app.services.pedigree-relation :as svc-pr]
            [slingshot.slingshot :refer [throw+]]
            [clojure.algo.monads :refer :all]))

(defn add-person-from-parent [person parent func]
  (domonad maybe-m
           [person-node (-> (:id person)
                            (svc-person/find-by-id)
                            (:node))
            parent-id   (:id parent)
            parent-node (-> (svc-person/find-by-id parent-id)
                            (:node))]
           (func person-node parent-node)))

(defn from-parent
  "Add person from father and mother"
  [person father mother]
  (println father)
  (println mother)
  {:father-child (add-person-from-parent person father svc-pr/add-from-father)
   :mother-child (add-person-from-parent person mother svc-pr/add-from-mother)})
