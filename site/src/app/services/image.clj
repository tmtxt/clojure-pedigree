(ns app.services.image
  (:require [app.services.util :refer [call-multipart]]
            [slingshot.slingshot :refer [try+ throw+]]))

(defn add [path type]
  (try+
   (call-multipart :svc-image "/add" :post
                   [{:name "image" :content (clojure.java.io/file path)}
                    {:name "type" :content type}])
   (catch Object err (println err))))
