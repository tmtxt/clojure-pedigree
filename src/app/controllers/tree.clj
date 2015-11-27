(ns app.controllers.tree
  (:require [compojure.core :refer :all]
            [app.tree.main :as tree]
            [ring.util.response :refer [response]]
            [app.views.layout :refer [render]]
            [app.util.main :as util]))

(defn get-tree [request]
  (response (tree/get-tree)))

(defn tree-page
  ;; render layout page for pedigree tree
  [request & [person-id]]
  (let [person-id (if person-id person-id "null")]
    (render request "tree/tree.html"
            {:personId person-id})))

(defn view-tree [request]
  (tree-page request))

(defn view-from-person [request]
  (let [person-id (util/param request "personId")]
    (tree-page request person-id)))

(def tree-routes
  (context
   "/tree" []
   (GET "/get" [] get-tree)
   (GET "/viewTree" [] view-tree)
   (GET "/view/:personId" [] view-from-person)))
