(ns site
  (:require [weasel.repl :as repl]))

(defn ^:export init []
  (.log js/console "hello world")
  (when-not (repl/alive?)
    (repl/connect "ws://localhost:9253")))
