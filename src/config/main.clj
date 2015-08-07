(ns config.main
  (:require [config.system :as system]))

(def app-config
  {:site-name "Clojure Pedigree"
    :homepage {:preface-image "/assets/img/preface.jpg"}
    })

(def config
  (merge
   system/config
   app-config
   ))
