(ns app.services.main
  (:require [config.services :refer [api-logic-host api-logic-port]]
            [clj-http.client :as client]
            [clojure.data.json :as json]
            [slingshot.slingshot :refer [throw+]]))
