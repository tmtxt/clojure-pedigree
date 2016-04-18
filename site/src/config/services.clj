(ns config.services
  (:require [environ.core :refer [env]]))

(def svc-user-host "svc.user")
(def svc-user-port "80")

(def svc-minor-content-host "svc.minor-content")
(def svc-minor-content-port "80")

(def svc-person-host "svc.person")
(def svc-person-port "80")
