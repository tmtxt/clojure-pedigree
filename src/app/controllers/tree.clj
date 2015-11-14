(ns app.controllers.tree
  (:require [compojure.core :refer :all]
            [app.tree.main :as tree]
            [ring.util.response :refer [response]]
            [app.views.layout :refer [render]]
            [clojure.data.json :as json]
            [clj-time.coerce :as c]))

(defn get-tree [request]
  (response (tree/get-tree)))

(defn tree-page
  ;; render layout page for pedigree tree
  [request]
  (render request "tree/tree.html"))

(def tree-routes
  (context
   "/tree" []
   (GET "/get" [] get-tree)
   (GET "/view" [] tree-page)))
