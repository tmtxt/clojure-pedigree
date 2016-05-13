(ns config.main
  (:require [config.system :as system]
            [environ.core :refer [env]]))

(def config
  {:site
   {:site-name (get env :site-name "Clojure Pedigree")}

   :pages
   {:home-page
    {:preface-image (get env :preface-image "/assets/img/preface.jpg")}}

   :minor-content
   {:preface-key "preface"
    :tree-description-key "tree-description"}

   :services
   {:svc-web
    {:ring-port (get env :svc-web-ring-port 3000)
     :nrepl-port (get env :svc-web-nrepl-port 7888)
     :root-git-dir "/usr/src/root"}

    :svc-user
    {:host (get env :svc-user-host "svc.user")
     :port (get env :svc-user-port "80")}

    :svc-minor-content
    {:host (get env :svc-minor-content-host "svc.minor-content")
     :port (get env :svc-minor-content-port "80")}

    :svc-person
    {:host (get env :svc-person-host "svc.person")
     :port (get env :svc-person-port "80")}

    :svc-pedigree-relation
    {:host (get env :svc-pedigree-relation-host "svc.pedigree-relation")
     :port (get env :svc-pedigree-relation-port "80")}

    :svc-marriage-relation
    {:host (get env :svc-marriage-relation-host "svc.marriage-relation")
     :port (get env :svc-marriage-relation-port "80")}

    :svc-image
    {:host (get env :svc-image-host "svc.image")
     :port (get env :svc-image-port "80")}}

   ;; un-categorised
   :default-person-image "/assets/img/userbasic.jpg"})
