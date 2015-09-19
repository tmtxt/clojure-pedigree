(ns app.controllers.person.add.from-child
  (:require [app.neo4j.main :as neo4j]
            [app.controllers.person.add.render :as render]
            [app.util.person :as person-util]
            [app.models.person :as person]
            [app.controllers.person.util :as controller-util]))

(defn process-get-request [request]
  (neo4j/with-transaction
    (let [child (controller-util/find-person-from-request request "childId")]
      (if (and child (-> child person/enough-parents? not))
        (render/render-add-page request {:action "add"
                                         :from "child"
                                         :child child})
        (render/render-add-page request))
      )))
