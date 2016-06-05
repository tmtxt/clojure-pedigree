(ns app.controllers.auth
  (:require [compojure.core :refer :all]
            [app.util.main :as util]
            [app.logger.log-trace :as log-trace]
            [app.helper.user :as user-helper]))

(defn get-current-user [request]
  (-> request
      user-helper/get-user-from-request
      util/response-success))

(def auth-api-routes
  (context "/api/auth" []
           (GET  "/user" [] get-current-user)))
