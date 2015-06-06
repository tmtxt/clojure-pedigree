(ns app.i18n.main
  (:require [app.i18n.en :as en]
            [app.i18n.vi :as vi]
            [taoensso.tower :as tower]))

(def tconfig
  {:dictionary (merge en/dict vi/dict)
   :dev-mode? false
   :fallback-locale :en})

(def t (tower/make-t tconfig))

(defn make-t
  "Make t based from the input local"
  [locale]
  (fn [key] (t locale key)))
