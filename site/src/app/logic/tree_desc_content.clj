(ns app.logic.tree-desc-content
  (:require [app.services.minor-content :as svc-minor-content]
            [slingshot.slingshot :refer [try+]]
            [config.main :refer [config]]))

(def key (:tree-description-key config))

(defn get "Get tree description content" []
  (svc-minor-content/find key))

(defn update "Update tree description content" [description]
  (svc-minor-content/update key {:content description}))

(defn add "Add tree desc content" [content]
  (svc-minor-content/add key {:content content}))
