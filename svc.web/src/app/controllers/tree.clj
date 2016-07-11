(ns app.controllers.tree
  (:require [compojure.core :refer :all]
            [ring.util.response :refer [response]]
            [clojure.data.json :as json]
            [app.views.main :refer [render-template render-page]]
            [app.util.main :as util]
            [app.services.api-tree :as api-tree]))

(defn get-tree-data [request]
  (let [
        ;; extract person id and depth
        params                       (util/params request)
        {id :personId depth :depth}  params

        ;; parse int
        args  (map util/parse-int [id depth])

        ;; get tree data from api-tree
        tree  (apply api-tree/get-tree args)
        ]
    (response tree)))

(defn get-tree-data2 [request]
  (let [
        ;; extract person id and depth
        params                       (util/params request)
        {id :personId depth :depth}  params

        ;; parse int
        args  (map util/parse-int [id depth])

        ;; get tree data from api-tree
        tree  (apply api-tree/get-tree args)
        ]
    (util/response-success tree)))

(defn tree-page
  "Render layout page for pedigree tree page"
  [request & {:keys [person-id depth]
              :or   {person-id nil
                     depth nil}}]
  (let [person-id (json/write-str person-id)
        depth     (json/write-str depth)]
    (render-template request "tree/tree.html"
                     {:personId  person-id
                      :depth     depth})))

(defn view-tree2 [request]
  (let [
        ;; extract the person id and depth
        params                              (util/params request)
        {person-id :personId depth :depth}  params
        ]
    (cond
      ;; no person id or depth provided
      (every? nil? [person-id depth])
      (tree-page request)

      ;; both person id and depth are provided
      (not-every? nil? [person-id depth])
      (tree-page request :person-id person-id :depth depth)

      ;; only person id provided
      (not (nil? person-id))
      (tree-page request :person-id person-id)

      ;; only depth provided
      :else
      (tree-page request :depth depth))))

(defn view-tree [request]
  (render-page "tree_view"))

(def tree-routes
  (context
   "/tree" []
   (GET "/index" [] view-tree)

   (GET "/data" [] get-tree-data)
   (GET "/view/" [] view-tree2)
   (GET "/view/person/:personId" [] view-tree)
   (GET "/view/depth/:depth" [] view-tree)
   (GET "/view/person/:personId/depth/:depth" [] view-tree)))

(def tree-api-routes
  (context
   "/api/tree" []
   (GET "/data" [] get-tree-data2)
   (GET "/view/" [] view-tree)
   (GET "/view/person/:personId" [] view-tree)
   (GET "/view/depth/:depth" [] view-tree)
   (GET "/view/person/:personId/depth/:depth" [] view-tree)))
