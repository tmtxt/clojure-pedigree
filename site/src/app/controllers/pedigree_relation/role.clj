(ns app.controllers.pedigree-relation.role)

(defn father-or-mother?
  "Determine whether this person entity should be father or mother"
  [entity]
  (let [roles-map {"male" :father
                   "female" :mother
                   "les" :father
                   "gay" :mother}
        gender (:gender entity)]
    (get roles-map gender :father)))

(defn male-or-female?
  "Determine whether this person entity should be treated as male for female"
  [entity]
  (let [roles-map {"male" :male
                   "female" :female
                   "gay" :female
                   "les" :male}
        gender (:gender entity)]
    (get roles-map gender :male)))
