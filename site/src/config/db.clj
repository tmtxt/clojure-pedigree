(ns config.db
  (:use [korma.db]
        [korma.core]
        [environ.core :refer [env]]))

(def db (postgres {:db "pedigree"
                   :user "postgres"
                   :password "password"
                   :host (env :POSTGRES_HOST)
                   :port (env :POSTGRES_PORT)
                   :delimiters ""}))

(defdb app-db db)
