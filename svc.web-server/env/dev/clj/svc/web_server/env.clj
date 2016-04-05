(ns svc.web-server.env
  (:require [selmer.parser :as parser]
            [clojure.tools.logging :as log]
            [svc.web-server.dev-middleware :refer [wrap-dev]]))

(def defaults
  {:init
   (fn []
     (parser/cache-off!)
     (log/info "\n-=[svc.web-server started successfully using the development profile]=-"))
   :middleware wrap-dev})
