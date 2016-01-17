(ns config.main
  (:require [config.system :as system]))

(def app-config
  {:site-name "Clojure Pedigree"
   :homepage {:preface-image "/assets/img/preface.jpg"}
   :default-person-image "/assets/img/userbasic.jpg"
   :preface-key "preface"
   })

(def config
  (merge
   system/config
   app-config
   ))
