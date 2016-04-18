(ns app.logic.tree-desc-content
  (:require [app.services.minor-content :as svc-minor-content]
            [slingshot.slingshot :refer [try+]]
            [config.main :refer [config]]))

(def key (:tree-description-key config))

(defn get "Get tree description content" []
  (svc-minor-content/find key))

(defn update "Update tree description content" [content]
  (svc-minor-content/update key {:content content}))
