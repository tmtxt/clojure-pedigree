(ns app.controllers.person.add
  (:require [app.controllers.person.util :as controller-util]
            [app.neo4j.main :as neo4j]
            [app.controllers.person.add.from-none :as from-none]
            [app.controllers.person.add.from-parent :as from-parent]
            [app.controllers.person.add.from-partner :as from-partner]))

(defn add-person-from-none [request]
  (from-none/process-get-request request))

(defn add-person-from-parent [request]
  (from-parent/process-get-request request))

(defn add-person-from-partner [request]
  (from-partner/process-get-request request))

;; (defn add-person-from-child [request]
;;   (from-child/process-get-request request))
