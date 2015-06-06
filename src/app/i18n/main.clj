(ns app.i18n.main
  (:require [app.i18n.en :as en]
            [app.i18n.vi :as vi]
            [taoensso.tower :as tower]))

(def tconfig
  {:dictionary (merge en/dict vi/dict)
   :dev-mode? false
   :fallback-locale :en})

(def t (tower/make-t tconfig))

(defn get-locale
  "Get locale from locale or request"
  [locale-or-request]
  (cond
    (map? locale-or-request) (get-in locale-or-request [:session :locale] :en)
    (string? locale-or-request) (keyword locale-or-request)
    (keyword? locale-or-request) locale-or-request
    :else :en))

(defn make-t
  "Make t from the input local"
  [locale-or-request]
  (let [locale (get-locale locale-or-request)]
    (fn [key] (t locale key))))

(defn make-t-with-scope
  "Make t from the input local with a scope"
  [locale-or-request scope]
  (let [locale (get-locale locale-or-request)]
    (fn [key] (first (tower/with-scope scope [(t locale key)])))))




















