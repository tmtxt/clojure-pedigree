(ns app.controllers.person.add
  (:require [app.controllers.person.util :as controller-util]
            [app.neo4j.main :as neo4j]
            [app.controllers.person.add.from-none :as from-none]))

(defn add-person-from-none [request]
  (from-none/process-get-request request))
