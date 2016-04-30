(ns config.services
  (:require [environ.core :refer [env]]))

(def svc-user-host "svc.user")
(def svc-user-port "80")

(def svc-minor-content-host "svc.minor-content")
(def svc-minor-content-port "80")

(def svc-person-host "svc.person")
(def svc-person-port "80")

(def svc-pedigree-relation-host "svc.pedigree-relation")
(def svc-pedigree-relation-port "80")

(def svc-marriage-relation-host "svc.marriage-relation")
(def svc-marriage-relation-port "80")

(def svc-image-host "svc.image")
(def svc-image-port "80")
