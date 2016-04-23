(ns app.logic.pedigree-relation
  (:require [app.services.pedigree-relation :as svc-pedigree-relation]
            [slingshot.slingshot :refer [throw+]]))

(defn detect-parent-role-single
  "Detect whether this person is father or mother"
  [person]
  (svc-pedigree-relation/detect-parent-role-single person))
