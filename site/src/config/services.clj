(ns config.services
  (:require [environ.core :refer [env]]))

(def svc-user-host (env :svc-user-host))
(def svc-user-port (env :svc-user-port))
