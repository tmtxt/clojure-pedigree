(ns app.controllers.person.add.from-none
  (:require [app.controllers.person.add.render :as render]))

(defn process-get-request [request]
  (render/render-add-page request))
