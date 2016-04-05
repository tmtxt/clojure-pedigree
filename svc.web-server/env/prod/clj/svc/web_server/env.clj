(ns svc.web-server.env
  (:require [clojure.tools.logging :as log]))

(def defaults
  {:init
   (fn []
     (log/info "\n-=[svc.web-server started successfully]=-"))
   :middleware identity})
