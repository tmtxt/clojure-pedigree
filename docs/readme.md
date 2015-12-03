# Prerequisites

- [VirtualBox](https://www.virtualbox.org/ ) - 5.0.10+
- [Vagrant](https://www.vagrantup.com/ ) - 1.7.4+
- [Ansible](http://www.ansible.com/home ) - 1.9.2+

# Setting up

```
$ git clone --recursive git@github.com:tmtxt/clojure-web-skeleton.git
$ vagrant up
```

# Dev server (in Vagrant)

Optionally, you may need to stop the upstart service before you can start the
server in dev mode

```
$ vagrant ssh
$ sudo service pedigree-ring-server stop
```

To start the server in dev mode

```
$ vagrant ssh
$ cd /vagrant
$ ./script/neo4j_start.sh
$ lein run
```

Nginx is pre-configured to serve on port 80, which is forwarded to 9250 on host machine.

# Production server

```
$ sudo -iu {project_user}
$ cd {site_dir}
$ ./script/neo4j_start.sh
$ sudo service pedigree-ring-server start
```

# Repl

Repl automatically starts on app startup and runs on port 7888, which is block
under firewall on production server. To connect to it from within Emacs (using
cider), you need to add the ssh config to `~/.ssh/config` first. If you are
using Vagrant, `vagrant ssh-config` will return the ssh information for you to
add to your config file.

After setting up ssh properly, `M-x` `cider-connect` `vagrant@hostname` `7888`
`RET` and you will be taken to the repl prompt.
