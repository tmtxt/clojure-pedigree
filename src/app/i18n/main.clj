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
  "Make t from the input local"
  [locale-or-request]
  (let [locale (cond
                 (map? locale-or-request) (get-in locale-or-request [:session :locale] :en)
                 (string? locale-or-request) (keyword locale-or-request)
                 (keyword? locale-or-request) locale-or-request
                 :else :en)]
    (fn [key] (t locale key))))
