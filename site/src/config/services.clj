(ns config.services
  (:require [environ.core :refer [env]]))

(def svc-user-host (env :svc-user-host))
(def svc-user-port (env :svc-user-port))

(def svc-minor-content-host (env :svc-minor-content-host))
(def svc-minor-content-port (env :svc-minor-content-port))
