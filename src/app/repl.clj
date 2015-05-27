(ns app.repl
  (:use app.handler
        ring.server.standalone
        [ring.middleware file-info file])
  (:require [clojure.tools.nrepl.server :as repl-server]
            [config.main :refer [config]]
            [app.models.user :as user-model]))

(defonce server (atom nil))

(defn get-handler []
  ;; #'app expands to (var app) so that when we reload our code,
  ;; the server is forced to re-resolve the symbol in the var
  ;; rather than having its own copy. When the root binding
  ;; changes, the server picks it up without having to restart.
  (-> #'app
    ; Makes static assets in $PROJECT_DIR/resources/public/ available.
    (wrap-file "resources")
    ; Content-Type, Content-Length, and Last Modified headers for files in body
    (wrap-file-info)))

(defn start-server
  "used for starting the server in development mode from REPL"
  [& [port]]
  (let [port (if port (Integer/parseInt port) (config :ring-port))]
    (reset! server
            (serve (get-handler)
                   {:port port
                    :init init
                    :auto-reload? true
                    :destroy destroy
                    :open-browser? false
                    :join true}))
    (println (str "You can view the site at http://localhost:" port))))

(defn stop-server []
  (.stop @server)
  (reset! server nil))

(defn start-repl []
  (repl-server/start-server :port (config :nrepl-port))
  (println (str "nRepl server running on port " (config :nrepl-port))))

(defn create-init-db []
  (user-model/create-init-users))
