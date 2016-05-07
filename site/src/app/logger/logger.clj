(ns app.logger.logger
  (:require [slingshot.slingshot :refer [try+ throw+]]
            [taoensso.timbre :as timbre]))

(def timbre-config
  {:level :debug
   :timestamp-opts {:pattern "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", :locale :jvm-default, :timezone :utc}})

(timbre/merge-config! timbre-config)
