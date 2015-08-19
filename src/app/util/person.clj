(ns app.util.person
  (:require [app.models.person :as person]))

(defn title-as-parent
  "Display title on add child page, return the key for look up in translation"
  [person-info]
  (let [gender-map person/GENDERS_MAP
        person-gender (:gender person-info)]
    (cond
      (= person-gender (:male gender-map)) :father-fullname
      (= person-gender (:female gender-map)) :mother-fullname
      (= person-gender (:gay gender-map)) :mother-fullname
      (= person-gender (:les gender-map)) :father-fullname
      :else :father-fullname
      )))
