# Clojure Pedigree Website

Pedigree Management website in Clojure

# not finished yet...

**TODO**:

- Clojure Script repl
- nginx configuration

# Documentation

Documentation is located under docs folder, you should read them in this order

- [Setup](https://github.com/tmtxt/clojure-web-skeleton/blob/master/docs/setup.md)
- [Provision](https://github.com/tmtxt/clojure-web-skeleton/blob/master/docs/provision.md)
- [Database](https://github.com/tmtxt/clojure-web-skeleton/blob/master/docs/database.md)
- [Models](https://github.com/tmtxt/clojure-web-skeleton/blob/master/docs/models.md)
- [Controllers](https://github.com/tmtxt/clojure-web-skeleton/blob/master/docs/controllers.md)
- [Views](https://github.com/tmtxt/clojure-web-skeleton/blob/master/docs/views.md)
- [Static Files](https://github.com/tmtxt/clojure-web-skeleton/blob/master/docs/static.md)
- [Logging](https://github.com/tmtxt/clojure-web-skeleton/blob/master/docs/logging.md)
- [Environment Variables](https://github.com/tmtxt/clojure-web-skeleton/blob/master/docs/environment.md)

# Provision

- Add host to ansible/hosts
- Add a file name **extra_vars.yml**, which defines the `project_dir` variable
(and other variable if you need)
- Execute `run.sh` in ansible folder

# Note

If you are running a VPS with less than 1GB of RAM, probably you need to setup
swap for using when compilation.
