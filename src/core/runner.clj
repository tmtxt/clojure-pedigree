(ns core.runner
  (:require [app.repl :as server]))

(defn -main
  [& args]
  (server/create-init-db)
  (server/start-server)
  (server/start-repl))
