(ns app.models.person.update
  (:require [app.models.person.definition :as definition]
            [korma.core :as kc]
            [app.models.person.validation :as validation]
            [slingshot.slingshot :refer [throw+ try+]]))

(defn update-person [id person-data]
  (try+
   (let [person-data (dissoc person-data :id)
         errors (validation/validate-person-data person-data)
         _ (when-not (empty? errors) (throw+ {:success false
                                              :message "Validation fails"
                                              :errors errors}))
         _ (kc/update definition/person
                    (kc/set-fields person-data)
                    (kc/where {:id id}))]
     {:success true
      :entity person-data})
   (catch [:success false] res res)))
