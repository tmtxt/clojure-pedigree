(ns app.controllers.tree
  (:require [compojure.core :refer :all]
            [app.tree.main :as tree]
            [app.views.layout :refer [render]]))

(defn get-tree [request]
  "Tree")

(defn tree-page
  ;; render layout page for pedigree tree
  [request]
  (render request "tree/tree.html"))

(def tree-routes
  (context
   "/tree" []
   (GET "/get" [] get-tree)
   (GET "/view" [] tree-page)))
