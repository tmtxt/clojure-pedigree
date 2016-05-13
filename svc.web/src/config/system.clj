(ns config.system
  (:require [environ.core :refer [env]]))

(def config
  {:ring-port 3000
   :nrepl-port 7888
   :root-git-dir "/usr/src/root"})
