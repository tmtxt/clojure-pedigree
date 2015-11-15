(ns app.controllers.person.delete
  (:require [app.neo4j.main :as neo4j]
            [korma.db :as kd]
            [app.util.person :as person-util]
            [app.views.layout :as layout]
            [app.util.main :as util]
            [clojure.data.json :as json]
            [app.controllers.person.util :as controller-util]
            [app.models.person :as person-model]
            [app.util.db-util :as db-util]
            [clj-time.format :as f]
            [clj-time.coerce :as c]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn handle-get-request [request]
  "hello")
