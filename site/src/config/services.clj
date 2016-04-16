(ns config.services
  (:require [environ.core :refer [env]]))

(def api-logic-host (env :api-logic-host))
(def api-logic-port (env :api-logic-clj-port))

(def svc-user-host (env :svc-user-host))
(def svc-user-port (env :svc-user-port))
