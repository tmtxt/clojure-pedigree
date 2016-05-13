(ns app.views.version
  (:require [clj-jgit.porcelain :as git]
            [config.main :refer [config]]))

(def version (-> (get-in config [:services :svc-web :root-git-dir])
                 git/load-repo
                 git/git-log
                 first
                 .getName))
