(ns config.system
  (:require [environ.core :refer [env]]))

(def config
  {:ring-port (env :WEB_SERVER_PORT)
   :nrepl-port 7888
   :root-git-dir "/usr/src/root"
   })
