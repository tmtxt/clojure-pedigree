(ns app.controllers.person.add.from-none
  (:require [app.neo4j.main :as neo4j]
            [app.controllers.person.add.render :as render]))

(defn process-get-request [request]
  (neo4j/with-transaction
    (render/render-add-page request)))
