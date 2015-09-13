(ns app.util.person
  (:require [app.models.person :as person]
            [app.i18n.main :refer [make-t-with-scope]]))

(defn title-as-parent
  "Display title for person and partner on add child page,
  return the keys for look up in translation
  (person-display-key partner-display-key)"
  [person-info]
  (let [gender-map person/GENDERS_MAP
        person-gender (:gender person-info)]
    (cond
      (= person-gender (:male gender-map)) [:father-fullname :mother-fullname]
      (= person-gender (:female gender-map)) [:mother-fullname :father-fullname]
      (= person-gender (:gay gender-map)) [:mother-fullname :father-fullname]
      (= person-gender (:les gender-map)) [:father-fullname :mother-fullname]
      :else [:father-fullname :mother-fullname]
      )))

(defn determine-father-mother
  "Determine the input parent and partner to see who is the father, who is the mother"
  [parent partner]
  (let [parent-gender (:gender parent)
        gender-map person/GENDERS_MAP]
    (cond
      (= parent-gender (:male gender-map)) {:father parent :mother partner}
      (= parent-gender (:female gender-map)) {:father partner :mother parent}
      (= parent-gender (:gay gender-map)) {:father partner :mother parent}
      (= parent-gender (:les gender-map)) {:father parent :mother partner}
      :else {:father parent :mother partner}
      )))

(defn determine-father-mother-single
  "Determin whether the input parent is father or mother based on the gender"
  [parent]
  (let [parent-gender (:gender parent)
        gender-map person/GENDERS_MAP]
    (cond
      (= parent-gender (:male gender-map)) :father
      (= parent-gender (:female gender-map)) :mother
      (= parent-gender (:gay gender-map)) :mother
      (= parent-gender (:les gender-map)) :father
      :else :father
      )))

(defn determine-partner-role-single
  "Determine whether the input person should be wife or husband"
  [person]
  (let [gender-map person/GENDERS_MAP
        person-gender (:gender person)]
    (cond
      (= person-gender (:male gender-map)) :husband
      (= person-gender (:female gender-map)) :wife
      (= person-gender (:gay gender-map)) :wife
      (= person-gender (:les gender-map)) :husband
      :else :husband
      )))

(defn make-display-map [request map]
  (let [t (make-t-with-scope request :person)
        func #(t %)]
    (into {} (for [[k v] map] [(name k) (func k)]))))

(defn status-display
  "Make the statuses display map based on locale in the request"
  [request]
  (let [statuses-map person/STATUSES_MAP]
    (make-display-map request statuses-map)))

(defn status-display
  "Make the statuses display map based on locale in the request"
  [request]
  (let [statuses-map person/STATUSES_MAP]
    (make-display-map request statuses-map)))

(defn gender-display
  "Make the genders display map based on locale in the request"
  [request]
  (let [genders-map person/GENDERS_MAP]
    (make-display-map request genders-map)))

(defn- filter-person-keys [person]
  (let [select-fn #(select-keys % [:full_name :picture :id])]
    (select-fn person)))

(defn filter-parent-keys
  "Filter unnecessary parent keys"
  [parent]
  (let [{father :father
         mother :mother} parent]
    (cond
      father (let [father (filter-person-keys father)]
               (assoc parent :father father))
      mother (let [mother (filter-person-keys mother)]
               (assoc parent :mother mother)))))

(defn filter-partner-keys
  "Filter unnecessary partner keys"
  [partner]
  (let [{husband :husband
         wife :wife} partner]
    (cond
      husband (let [husband (filter-person-keys husband)]
                (assoc partner :husband husband))
      wife (let [wife (filter-person-keys wife)]
             (assoc partner :wife wife)))))

(defn filter-persons-keys [persons]
  (map filter-person-keys persons))

(defn parent-role-genders
  "Get all the possible genders for this parent role"
  [role]
  (let [gender-map person/GENDERS_MAP]
    (cond
      (= role "father") [(gender-map :male) (gender-map :les) (gender-map :unknown)]
      (= role "mother") [(gender-map :female) (gender-map :gay) (gender-map :unknown)]
      :else [(gender-map :male) (gender-map :les) (gender-map :female) (gender-map :gay) (gender-map :unknown)]
      )))
