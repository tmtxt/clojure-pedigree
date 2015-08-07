(ns app.i18n.main
  (:require [app.i18n.en :as en]
            [app.i18n.vi :as vi]
            [taoensso.tower :as tower]))

(def tconfig
  {:dictionary (merge en/dict vi/dict)
   :dev-mode? false
   :fallback-locale :vi})

(def t (tower/make-t tconfig))

(defn get-locale
  "Get locale from locale or request"
  [locale-or-request]
  (cond
    (map? locale-or-request) (get-in locale-or-request [:session :locale] :vi)
    (string? locale-or-request) (keyword locale-or-request)
    (keyword? locale-or-request) locale-or-request
    :else :vi))

(defn make-t
  "Make t from the input local"
  [locale-or-request]
  (let [locale (get-locale locale-or-request)]
    (fn [key] (t locale key))))

(defn make-t-with-scope
  "Make t from the input local with a scope"
  [locale-or-request scope]
  (let [locale (get-locale locale-or-request)]
    locale
    locale
    (fn [key] (first (tower/with-scope scope [(t locale key)])))))

(defn make-layout-tran [locale-or-request]
  (let [t (make-t-with-scope locale-or-request :layout)
        layout-dict (get-in vi/dict [:vi :layout])
        layout-keys (keys layout-dict)
        layout-tran (map (fn [k] {k (t k)}) layout-keys)]
    (apply merge layout-tran)))
