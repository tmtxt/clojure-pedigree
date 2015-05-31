# Note

Clojurescript has not released the stable version yet and the cljs plugins got
many errors between each version so use it at your own risk.

# Cljs source files

Clojurescript files are defined in `cljs` folder and are outputed to the folder
`resources/public/cljs`. Refer to Clojurescript documentation for how to use it.

# Build and watch

- To build for dev

```
$ lein cljsbuild once dev
```

- To build for production

```
$ lein cljsbuild once dev
```

- To build and watch

```
$ lein cljsbuild auto dev
```

# Cljs Repl

Cljs repl is done by inserting a piggieback middle into nRepl. The repl is
achieved using [weasel](https://github.com/tomjakubowski/weasel). To enter cljs
repl, first start an nRepl session by `lein repl` or connect to the running
nRepl session using your favorite client.

Execute these command at the repl

```
user> (require 'weasel.repl.websocket)
nil
user> (cemerick.piggieback/cljs-repl
        :repl-env (weasel.repl.websocket/repl-env
                   :ip "0.0.0.0" :port 9001))

<< started Weasel server on ws://0.0.0.0:9001 >>
Type `:cljs/quit` to stop the ClojureScript REPL
nil
```

In cljs file, add something like this, replace 9001 with the forwarded port by Vagrant

```
(ns my.cljs.core
  (:require [weasel.repl :as repl]))

(when-not (repl/alive?)
  (repl/connect "ws://localhost:9001"))
```
