(ns app.controllers.admin.preface
  (:require [app.views.layout :refer [render render-message]]
            [app.util.main :as util]
            [slingshot.slingshot :refer [try+ throw+]]
            [validateur.validation :as vl]))

(defn preface-render [request]
  (render request "admin/preface.html"))
