(ns config.main
  (:require [environ.core :refer [env]]))

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
    {:ring-port (get env :ms-svc-web-ring-port 3000)
     :nrepl-port (get env :ms-svc-web-nrepl-port 7888)
     :root-git-dir "/usr/src/root"}

    :svc-user
    {:host (get env :ms-svc-user-host)
     :port (get env :ms-svc-user-port)}

    :svc-minor-content
    {:host (get env :ms-svc-minor-content-host)
     :port (get env :ms-svc-minor-content-port)}

    :svc-person
    {:host (get env :ms-svc-person-host)
     :port (get env :ms-svc-person-port)}

    :svc-pedigree-relation
    {:host (get env :ms-svc-pedigree-relation-host)
     :port (get env :ms-svc-pedigree-relation-port)}

    :svc-marriage-relation
    {:host (get env :ms-svc-marriage-relation-host)
     :port (get env :ms-svc-marriage-relation-port)}

    :svc-image
    {:host (get env :ms-svc-image-host)
     :port (get env :ms-svc-image-port)}

    :svc-api-tree
    {:host (get env :ms-svc-api-tree-host)
     :port (get env :ms-svc-api-tree-port)}}

   :logs
   {:exclude-body-content-types ["text/html"]}})
