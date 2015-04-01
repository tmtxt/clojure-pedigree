(ns config.main
  (:require [config.system :as system]))

(def config
  (merge
   system/config
   {:site-name "Clojure Pedigree"}))
