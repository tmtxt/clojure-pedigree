# Clojure Pedigree Website

Vietnamese Pedigree Management website in Clojure, based on Docker, Clojure, Nodejs, Postgres, Neo4j
and a bunch of other things.

# Show me the site

Okay, head to [http://giapha.truongtx.me](http://giapha.truongtx.me)

# Requirements

- Ansible 1.9+: mostly for first time provision
- Virtualbox
- Docker/Docker Machine/Docker Compose
- GNU sed and GNU tee. (Mostly for for auto replace entry in `hosts` file, not very important).
  Pre-installed on Linux. On mac, install gnu coreutils, findutils from your package manager.
- A good editor and terminal

# Setup and run

- Clone this repo, put it to `/Users/personal/clojure-pedigree` (fixed path for now, will update later)
- Create a new docker machine with name `pd` (fixed name again, but will update later)

```
$ docker-machine create -d virtualbox --virtualbox-memory 2048 --virtualbox-disk-size 250000 pd
```

- Start the machine with

```
$ docker-matchine start pd
```

- Source env file for docker machine env and some useful aliased

```
$ . ./set-env.sh          # dev env
$ . ./set-env.prod.sh     # prod env
```

- Run the provision script (build docker images, install dependencies, migrate database, build
  frontend files), require Ansible for this

```
$ ./setup.sh            # dev env
$ ./setup.prod.sh       # prod env
```

- View the website at http://pd.dev:3000

# Development workflow

- Source the env file first

```
$ . ./set-env.sh          # dev env
```

- Start all containers in background using

```
$ dcud         # aliased to docker-compose up -d
```

- View logs of specific service using `dcl` (aliased to docker-compose logs). TAB suggestion works since the services have the same
  name with its respective folder

```
$ dcl svc.web
$ dcl svc.image
$ dcl svc.person
```

- Start and attach to one specific service using its name. Using CTRL+C to stop the process like you
usually do with normal development without Docker.

```
$ svc.web
Killing clojurepedigree_svc.web_1 ... done
Starting clojurepedigree_koa.api.base_1
Starting clojurepedigree_neo4j.storage_1
clojurepedigree_neo4j_1 is up-to-date
clojurepedigree_svc.pedigree-relation_1 is up-to-date
clojurepedigree_svc.marriage-relation_1 is up-to-date
Starting clojurepedigree_postgres.storage_1
clojurepedigree_postgres_1 is up-to-date
clojurepedigree_svc.person_1 is up-to-date
clojurepedigree_svc.tree_1 is up-to-date
clojurepedigree_svc.api-tree_1 is up-to-date
clojurepedigree_svc.minor-content_1 is up-to-date
clojurepedigree_svc.image_1 is up-to-date
clojurepedigree_svc.user_1 is up-to-date
Starting clojurepedigree_svc.web_1
Attaching to clojurepedigree_svc.web_1
svc.web_1 | SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
svc.web_1 | SLF4J: Defaulting to no-operation (NOP) logger implementation
svc.web_1 | SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
svc.web_1 | Sample data inserted
svc.web_1 | app is starting
svc.web_1 | Started server on port 3000
svc.web_1 | nRepl server running on port 7888
```

- Logs can be viewed directly in the console or using `dcl` or using kibana at `http://pd.dev:5601`

# Further readings

- [Structure](docs/structure.md)

