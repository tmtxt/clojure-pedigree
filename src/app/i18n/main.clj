(ns app.i18n.main
  (:require [app.i18n.en :as en]
            [app.i18n.vi :as vi]))

(def tconfig
  {:dictionary (merge en/dict vi/dict)
   :dev-mode? false
   :fallback-locale :en})
