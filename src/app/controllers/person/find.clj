(ns app.controllers.person.find
  (:require [app.neo4j.main :as neo4j]
            [app.models.person :as person]
            [app.util.person :as person-util]
            [ring.util.response :refer [response]]
            [app.util.main :as util]))

(defn find-list-simple [request]
  (neo4j/with-transaction
    (let [{parent-id :parentId
           term :term
           parent-role :parentRole} (util/params request)]
      (cond
        ;; TODO update this later
        (and parent-id term)
        (let [person-list (-> term person/find-by-name person-util/filter-persons-keys)]
          (response person-list))

        (and parent-role term)
        (let [person-list (-> term person/find-by-name person-util/filter-persons-keys)]
          (response person-list))

        parent-role
        (let [role-genders (person-util/parent-role-genders parent-role)
              person-list (-> role-genders person/find-by-genders person-util/filter-persons-keys)]
          (response person-list))

        parent-id
        (let [partners (-> parent-id person/find-partners person-util/filter-persons-keys)]
          (response partners))

        term
        (let [all (-> term person/find-by-name person-util/filter-persons-keys)]
          (response all))

        :else
        (response [])
        ))
    ))
