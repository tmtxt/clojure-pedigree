(ns app.services.image
  (:require [app.services.util :refer [call-multipart call-json]]
            [slingshot.slingshot :refer [try+ throw+]]))

(def content-types
  {"image/png" ".png"
   "image/jpg" ".jpg"
   "image/jpeg" ".jpg"})

(defn- create-file [file]
  (if (string? file)
    (clojure.java.io/file file)
    (clojure.java.io/file (.getPath (:tempfile file)))))

(defn add [file type]
  (try+
   (-> (call-multipart :svc-image "/add" :post
                       [{:name "image" :content (create-file file)}
                        {:name "type" :content type}
                        {:name "ext" :content (get content-types (:content-type file) ".jpg")}])
       (:data)
       (:image-name))
   (catch Object _ nil)))

(defn delete [file-name type]
  (call-json :svc-image "/delete" :post
             {:name file-name
              :type type}))
