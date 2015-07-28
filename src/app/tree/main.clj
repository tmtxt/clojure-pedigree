(ns app.tree.main
  (:require [app.models.person :as person]
            [app.util.neo4j.command :as ncm]
            [com.rpl.specter :refer :all]))

(def ^{:private true} default-depth 5)

(defn- recur1 [tree rows]
  (let [row (first rows)]
    (if row
      (let [[path rel in-parent out-parent child] row
            short-path (vec (drop-last path))
            new-tree (assoc-in tree short-path {})]
        (recur new-tree (rest rows)))
      tree)))



(defn recur2 [path user-data]
  (let [sub-path (rest path)
        sub-id (first path)
        children (get user-data :children [])
        ;; idx (.indexOf children (second path))
        temp (first (select [ALL :user-id (fn [id] (= (second path) id))] children))
        idx (.indexOf children temp)
        user-data2 (assoc user-data :children children)
        ]

    (if sub-id
      (let [user-data3 (assoc user-data2 :user-id sub-id)
            sub (recur2 sub-path user-data3)
            user-data4 (assoc-in user-data3 [:children (if (= idx -1) 0 idx)] sub)
            ]
        user-data4)
      sub-id)
    ))

(defn recur4 [path user-data]
  (let [sub-path (rest path)
        sub-id (first path)
        children (get user-data :children [])
        temp (first (transform [ALL :user-id (fn [id] (= (second path) id))] (fn [a] a) children))
        idx (.indexOf children temp)
        user-data2 (assoc user-data :children children)
        ]

    (if sub-id
      (let [user-data3 (assoc user-data2 :user-id sub-id)
            sub (recur2 sub-path user-data3)
            ;; user-data4 (assoc-in user-data3 [:children (if (= idx -1) 0 idx)] sub)
            user-data4 (if (= idx -1)
                         (let [new-children (conj children sub)]
                           (assoc user-data3 :children new-children)
                           )
                         (assoc-in user-data3 [:children idx] sub))
            ]
        (println user-data4)
        user-data4)
      sub-id)
    ;; user-data
    ))

(defn recur5 [path tree assoc-path]
  (let [children-path (rest path)
        continue (not (empty? children-path))
        user-id (first path)
        tree (assoc-in tree (conj assoc-path :user-id) user-id)]
    (if continue
      (let [children (get-in tree (conj assoc-path :children) [])
            ;; tree (if (empty? children) (assoc-in tree (conj assoc-path :children) children) tree)
            child-id (second path)
            child-set (filter (fn [child] (= (:user-id child) child-id)) children)
            child (if (empty? child-set) {} (first child-set))
            idx (if (empty? child-set) (count children) (.indexOf children child))
            child-assoc-path (conj assoc-path :children idx)
            tree (if (empty? children) (assoc-in tree (conj assoc-path :children) children) tree)]
        (recur5 children-path tree child-assoc-path)
        )
      tree)))

(defn f []
  (let [path [[1 2]
              [1 2 3]
              [1 2 3 5]
              [1 2 3 6]
              [1 2 4]
              [1 2 4 7]
              [1 2 8]
              [1 2 8 9]
              [1 2 8 9 10]
              [1 2 8 9 11]
              [1 2 8 12]
              [1 2 8 12 13]
              [1 14]]
        func (fn [user-data link]
               (recur5 link user-data))
        ;; tree (reduce func {} path)
        ]
    (let [tree (recur5 [1 2 4]
                       {:user-id 1
                        :children [{:user-id 3
                                    :children [{:user-id 5}]}
                                   {:user-id 2
                                    :children []}]}
                       [])]
      (clojure.pprint/pprint tree))

    ))

;; (defn f []
;;   (let [path [1 2 3 4 5 6]
;;         tree (recur2 path {})]
;;     (clojure.pprint/pprint tree)
;;     ))

;; (defn process [path user-data]
;;   (let [sub-path (rest path)
;;         sub-id (first sub-path)
;;         idx (index-of sub-id (:children user-data))
;;         sub (process sub-path (get-in [:children idx] {:user_id sub-id
;;                                                        :chidren []}))]
;;     (assoc-in user-data [:children (or idx 0)] sub)))

;; (reduce (fn [root row] (process root (first row))) {})

(defn- get-tree-from-node [root & [depth]]
  (let [rows (ncm/query-tree (:user_id root) depth)
        init-tree {(:user_id root) {}}]
    (recur1 init-tree rows)
    ))

(defn get-tree
  "Get tree from user id"
  ([]
   (let [root-node (person/find-root-node)]
     (get-tree-from-node root-node default-depth)))

  ([user-id]
   (let [root-node (person/find-node-by-user-id user-id)]
     (get-tree-from-node root-node default-depth)))

  ([user-id & {:keys [depth]
               :or [depth default-depth]}]
   (let [root-node (person/find-node-by-user-id user-id)]
     (get-tree-from-node root-node depth))))
