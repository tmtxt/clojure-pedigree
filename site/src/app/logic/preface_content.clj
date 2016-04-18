(ns app.logic.preface-content
  (:require [app.services.minor-content :as svc-minor-content]
            [slingshot.slingshot :refer [try+]]
            [config.main :refer [config]]))

(def key (:preface-key config))

(defn get "Get preface content" []
  (svc-minor-content/find key))

(defn update "Update preface content" [content]
  (svc-minor-content/update key {:content content}))
