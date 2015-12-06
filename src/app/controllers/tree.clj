(ns app.controllers.tree
  (:require [compojure.core :refer :all]
            [app.tree.main :as tree]
            [ring.util.response :refer [response]]
            [clojure.data.json :as json]
            [app.views.layout :refer [render]]
            [app.util.main :as util]))

(defn get-tree-data [request]
  (let [params (util/params request)
        person-id (-> params :personId util/parse-int)
        depth (-> params :depth util/parse-int)]
    (response (tree/get-tree :person-id person-id :depth depth))))

(defn tree-page
  ;; render layout page for pedigree tree
  [request & {:keys [person-id depth]
              :or {person-id nil
                   depth nil}}]
  (let [person-id (json/write-str person-id)
        depth (json/write-str depth)]
    (render request "tree/tree.html"
            {:personId person-id
             :depth depth})))

(defn view-tree [request]
  (let [params (util/params request)
        person-id (:personId params)
        depth (:depth params)]
    (cond
      (every? nil? [person-id depth]) (tree-page request)
      (not-every? nil? [person-id depth]) (tree-page request :person-id person-id :depth depth)
      (not (nil? person-id)) (tree-page request :person-id person-id)
      :else (tree-page request :depth depth))))

(defn export-tree [request]
  (render request "tree/export.html"))

(def tree-routes
  (context
   "/tree" []
   (GET "/data" [] get-tree-data)

   (GET "/view/" [] view-tree)
   (GET "/view/person/:personId" [] view-tree)
   (GET "/view/depth/:depth" [] view-tree)
   (GET "/view/person/:personId/depth/:depth" [] view-tree)

   (GET "/export/person/:personId" [] export-tree)))
