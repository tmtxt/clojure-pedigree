(ns app.logic.pedigree-relation
  (:require [app.services.pedigree-relation :as svc-pedigree-relation]
            [app.services.person :as svc-person]
            [slingshot.slingshot :refer [throw+]]))

(defn detect-parent-role-single
  "Detect whether this person is father or mother"
  [person]
  (svc-pedigree-relation/detect-parent-role-single person))

(defn enough-parents?
  "Detect whether this person has enough parents"
  [person]
  (let [person-node   (-> (:id person)
                          (svc-person/find-by-id)
                          (:node))
        parents-count (svc-pedigree-relation/count-parents person-node)]
    (= parents-count 2)))
