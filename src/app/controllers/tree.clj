(ns app.controllers.tree
  (:require [compojure.core :refer :all]))

(defn get-tree [request]
  "Tree")

(def tree-routes
  (context
   "/tree" []
   (GET "/get" [] get-tree)))
