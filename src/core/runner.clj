(ns core.runner
  (:require [app.repl :as server]))

(defn -main
  [& args]
  (server/start-server)
  (server/start-repl))
