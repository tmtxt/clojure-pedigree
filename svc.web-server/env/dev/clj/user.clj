(ns user
  (:require [mount.core :as mount]
            svc.web-server.core))

(defn start []
  (mount/start-without #'svc.web-server.core/repl-server))

(defn stop []
  (mount/stop-except #'svc.web-server.core/repl-server))

(defn restart []
  (stop)
  (start))


