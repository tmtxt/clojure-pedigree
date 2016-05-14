#!/usr/bin/env sh

# remove the old ip in hosts file
sudo sed -i "/\b\(pd.dev\)\b/d" /etc/hosts

# insert the new ip
echo "$(docker-machine ip test) pd.dev" | sudo tee -a /etc/hosts

# set env variables
eval "$(docker-machine env test)" OR $(docker-machine env test)

# aliases
alias dcu="docker-compose up"
alias dcud="docker-compose up -d"
alias dcp="docker-compose ps"
alias dcr="docker-compose rm"
alias dcl="docker-compose logs"
alias dcb="docker-compose build"

function attach {
    docker exec -it $(docker-compose ps | grep "$1" | awk '{print $1}') bash
}

# attach neonode
function an {
    docker exec -it $(docker-compose ps | grep 'neonode' | awk '{print $1}') bash
}

function kill_and_run {
    docker-compose kill $1
    docker-compose up $1
}

function svc.web {
    kill_and_run "svc.web"
}

function svc.person {
    kill_and_run "svc.person"
}

function svc.tree {
    kill_and_run "svc.tree"
}
