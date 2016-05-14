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
    {:host "svc.user"
     :port "80"}

    :svc-minor-content
    {:host "svc.minor-content"
     :port "80"}

    :svc-person
    {:host "svc.person"
     :port "80"}

    :svc-pedigree-relation
    {:host "svc.pedigree-relation"
     :port "80"}

    :svc-marriage-relation
    {:host "svc.marriage-relation"
     :port "80"}

    :svc-image
    {:host "svc.image"
     :port "80"}

    :svc-tree
    {:host "svc.tree"
     :port "80"}}

   :logs
   {:exclude-body-content-types ["text/html"]}

   ;; un-categorised, will be deleted later
   :default-person-image "/assets/img/userbasic.jpg"})
