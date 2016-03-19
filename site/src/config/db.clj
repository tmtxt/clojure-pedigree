(ns config.db
  (:use [korma.db]
        [korma.core]
        [environ.core :refer [env]]))

(def db (postgres {:db "pedigree"
                   :user "postgres"
                   :password "password"
                   :host (env :postgres-host)
                   :port (env :postgres-port)
                   :delimiters ""}))

(defdb app-db db)
