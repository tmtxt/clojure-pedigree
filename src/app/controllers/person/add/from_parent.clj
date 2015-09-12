(ns app.controllers.person.add.from-parent
  (:require [app.neo4j.main :as neo4j]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.controllers.person.util :as controller-util]))

(defn process-get-request [request]
  (neo4j/with-transaction
    (let [parent (controller-util/find-person-from-request request "parentId")]
      (if parent
        (let [parent-role (person-util/determine-father-mother-single parent)]
          (render/render-add-page request {:action "add"
                                           :from "parent"
                                           :parent {parent-role parent}}))
        (render/render-add-page request)))))
