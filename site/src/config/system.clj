(ns config.system
  (:require [environ.core :refer [env]]))

(def config
  {:ring-port (Integer/parseInt (env :web-server-port))
   :nrepl-port 7888
   :root-git-dir "/usr/src/root"})
