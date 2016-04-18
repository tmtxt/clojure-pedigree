(ns app.logic.minor-content
  (:require [app.services.minor-content :as svc-minor-content]
            [slingshot.slingshot :refer [try+]]))

(defn find [key]
  (try+
   (svc-minor-content/find key)
   (catch Object _ nil)))
