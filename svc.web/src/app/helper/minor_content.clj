(ns app.helper.minor-content
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [app.services.minor-content :as svc-minor-content]
            [config.main :refer [config]]))

(def ^:private preface-key (get-in config [:minor-content :preface-key]))
(def ^:private tree-description-key
  (get-in config [:minor-content :tree-description-key]))

(defn- get-content "Get minor content" [key]
  (-> key
      svc-minor-content/find
      :value))

(defn- update-content "Update minor content" [key value]
  (svc-minor-content/update key value))

(defn get-preface "Get preface content" []
  (get-content preface-key))

(defn update-preface "Update preface content" [value]
  (update-content preface-key value))

(defn get-tree-description "Get tree description" []
  (get-content tree-description-key))

(defn update-tree-description "Update tree description content" [value]
  (update-content tree-description-key value))
