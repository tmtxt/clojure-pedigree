(ns app.repl
  (:use app.handler
        ring.server.standalone
        [ring.middleware file-info file])
  (:require [clojure.tools.nrepl.server :as repl-server]
            [config.main :refer [config]]
            [cider.nrepl :refer [cider-nrepl-handler]]
            [app.data.init :refer [create-init-data]]))

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
  (let [port (if port (Integer/parseInt port) (-> config
                                                  (get-in [:services :svc-web :ring-port])
                                                  (Integer/parseInt)))]
    (reset! server
            (serve (get-handler)
                   {:port port
                    :init init
                    :auto-reload? true
                    :destroy destroy
                    :open-browser? false
                    :join true}))))

(defn stop-server []
  (.stop @server)
  (reset! server nil))

(defn start-repl []
  (let [repl-port (-> config
                      (get-in [:services :svc-web :nrepl-port])
                      (Integer/parseInt))]
    (repl-server/start-server :port repl-port
                              :bind "0.0.0.0"
                              :handler cider-nrepl-handler)
    (println (str "nRepl server running on port " repl-port))))

(defn create-init-db []
  (create-init-data))
