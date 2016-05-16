(ns app.controllers.tree
  (:require [compojure.core :refer :all]
            [ring.util.response :refer [response]]
            [clojure.data.json :as json]
            [app.views.main :refer [render-template]]
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

(defn view-tree [request]
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

(def tree-routes
  (context
   "/tree" []
   (GET "/data" [] get-tree-data)
   (GET "/view/" [] view-tree)
   (GET "/view/person/:personId" [] view-tree)
   (GET "/view/depth/:depth" [] view-tree)
   (GET "/view/person/:personId/depth/:depth" [] view-tree)))
