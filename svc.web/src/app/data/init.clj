(ns app.data.init
  (:require [app.data.sample.person :as sample-person]
            [app.data.sample.user :as sample-user]
            [app.helper.minor-content :as minor-content]
            [app.services.user :as svc-user]
            [app.services.person :as svc-person]))

(def lorem "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")

(defn create-init-user []
  (when (= 0 (svc-user/count))
    (svc-user/add (sample-user/get-admin) :admin)))

(defn create-init-person
  "Create new persons when the app starts if there is no person presented yet"
  []
  (when (-> (svc-person/count)
            (= 0))
    (svc-person/add (sample-person/get-root-husband))))

(defn create-minor-content []
  (when (minor-content/preface-empty?)
    (minor-content/add-preface lorem))
  (when (minor-content/tree-description-empty?)
    (minor-content/add-tree-description lorem)))

(defn create-init-data []
  (binding [app.logger.log-trace/*log-data* {}]
    (create-minor-content)
    (create-init-user)
    (create-init-person)
    (println "Sample data inserted")))
