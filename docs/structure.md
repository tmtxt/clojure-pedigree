# Docker for all the things

The project is devided into several small parts, each manages one aspect of the site. To achieve
that, Docker seems like the only best solution for now.

# Containers list

### Database containers

- postgres: store app data
- neo4j: store relation between person nodes

### App services

- `svc.web`: server as a web server, main entry point and logic flow for the application. Nodejs would
  be more suitable for this but who cares. I just wanna try out new stuff and learn :D Clojure is
  chosen for this because at first, the app is a monolithic web app written in Clojure. This is the
  core logic from that monolithic.
- `svc.minor-content`: CRUD for minor content, the customizable content displayed on the web page.
- `svc.user`: CRUD for user, admin,...
- `svc.person`: CRUD for person, including both information in postgres and neo4j.
- `svc.pedigree-relation`: CRUD for pedigree relation between persons, including father->child and mother->child
- `svc.marriage-relation`: CRUD for marriage relation between persons, including husband->wife and
  wife->husband
- `svc.image`: manage and store images uploaded by user
- `svc.tree`: manage and query tree from database
- `svc.api-tree`: api logic flow for constructing tree data, including calls to svc.tree, svc.person,
  svc.pedigree-relation and svc.marriage-relation. This can be in the same code base with `svc.web`
  since it's the logic flow of the application. However, I feel it's too difficult and too ugly to
  write Clojure code for this (or I didn't write in the correct way, so I added an extra layer here).

### Log containers

- `log.fluentd`: tail the log files and push to `log.elasticsearch`
- `log.elasticsearch`: centralize data storage for logs
- `log.kibana`: frontend for elasticsearch to view log

# Doesn't it sound like a microservice architecture here?

Hmm, maybe I'm applying the microservice architecture here or I'm affected by the microservice style
(I'm working in a company that applies microservice). I'm not really a fan of microservice. I just
want to research and try out many stuffs on my personal project. I am affected by the functional
style and I want a design that separates the app to multiple small independent modules (just
like a pure function in functional programming). Feed it some data and it will return you the
new data without mutating the world outside of it. That's why we need the svc and the api layers.
