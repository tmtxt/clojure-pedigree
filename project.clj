(defproject skeleton "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"

  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/tools.nrepl "0.2.6"]
                 [compojure "1.3.1"]
                 [ring-server "0.3.1"]
                 [selmer "0.7.9"]
                 [lib-noir "0.9.5"]
                 [korma "0.4.0"]
                 [environ "1.0.0"]
                 [org.postgresql/postgresql "9.3-1100-jdbc41"]
                 [org.clojure/tools.cli "0.3.1"]
                 [org.clojure/tools.logging "0.3.1"]
                 [org.clojure/clojurescript "0.0-2665"]
                 [log4j "1.2.15" :exclusions [javax.mail/mail
                                              javax.jms/jms
                                              com.sun.jdmk/jmxtools
                                              com.sun.jmx/jmxri]]]

  :plugins [[lein-ring "0.8.12"]
            [lein-environ "1.0.0"]
            [lein-cljsbuild "1.0.4"]]

  :ring {:handler app.handler/app
         :init app.handler/init
         :destroy app.handler/destroy}

  :main core.runner

  :cljsbuild
  {:builds {:dev
            {:source-paths ["cljs"]
             :incremental true
             :compiler {:output-to "resources/public/cljs/main.js"
                        :source-map "resources/public/cljs/main.js.map"
                        :output-dir "resources/public/cljs"
                        :warnings true
                        :optimizations :whitespace
                        :pretty-print true}}

            :production
            {:source-paths ["cljs"]
             :incremental true
             :compiler {:output-to "resources/public/cljs/main.js"
                        :externs ["cljs/externs.js"]
                        :optimizations :advanced
                        :pretty-print false}}}}

  :profiles
  {:uberjar {:aot :all}

   :production
   {:ring
    {:open-browser? false, :stacktraces? false, :auto-reload? false}
    :env
    {:someconfig "production"}}

   :dev
   {:dependencies [[ring-mock "0.1.5"]
                   [ring/ring-devel "1.3.2"]
                   [com.cemerick/austin "0.1.6"]]
    :ring
    {:open-browser? false}
    :env
    {:someconfig "dev"}}})
