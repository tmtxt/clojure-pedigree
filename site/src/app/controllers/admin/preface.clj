(ns app.controllers.admin.preface
  (:require [app.views.layout :refer [render render-message]]
            [app.util.main :as util]
            [slingshot.slingshot :refer [try+ throw+]]
            [validateur.validation :as vl]
            [app.models.minor-content :refer [find-content]]))

(def ^:private key "preface")

(defn preface-render [request]
  (let [content (find-content key)]
    (render request "admin/preface.html" content)))
