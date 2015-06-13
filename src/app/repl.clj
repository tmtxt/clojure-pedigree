(ns app.repl
  (:use app.handler
        ring.server.standalone
        [ring.middleware file-info file])
  (:require [clojure.tools.nrepl.server :as repl-server]
            [config.main :refer [config]]
            [app.models.user :as user-model]
            [config.db]
            [app.models.person :as person-model]
            [cider.nrepl :refer [cider-nrepl-handler]]
            [app.util.neo4j :as neo4j]
            [cemerick.piggieback :refer [wrap-cljs-repl]]))

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
  ;; enable when using with cljs repl
  ;; (repl-server/start-server :port (config :nrepl-port)
  ;;                           :handler (repl-server/default-handler
  ;;                           #'wrap-cljs-repl))
  (repl-server/start-server :port (config :nrepl-port)
                            :handler cider-nrepl-handler)
  (println (str "nRepl server running on port " (config :nrepl-port))))

(defn create-init-db []
  (neo4j/create-indexes)
  (user-model/create-init-users)
  (person-model/create-init-person))
