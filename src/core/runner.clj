(ns core.runner
  (:require [app.repl :as server]))

(defn -main
  [& args]
  (server/start-server)
  (server/start-repl)
  (println (str "nRepl server running on port " nrepl-port)))
