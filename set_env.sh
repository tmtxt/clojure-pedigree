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

# attach web server
function aw {
    docker exec -it $(docker-compose ps | grep 'server' | awk '{print $1}') bash
}

# attach svc person
function asp {
    docker exec -it $(docker-compose ps | grep 'svc.person' | awk '{print $1}') bash
}

# attach svc user
function asu {
    docker exec -it $(docker-compose ps | grep 'svc.user' | awk '{print $1}') bash
}

# attach svc image
function asi {
    docker exec -it $(docker-compose ps | grep 'svc.image' | awk '{print $1}') bash
}

# attach minor content
function asmc {
    docker exec -it $(docker-compose ps | grep 'svc.minor-content' | awk '{print $1}') bash
}

# attach svc pedigree relation
function aspr {
    docker exec -it $(docker-compose ps | grep 'svc.pedigree-relation' | awk '{print $1}') bash
}

# attach svc marriage relation
function asmr {
    docker exec -it $(docker-compose ps | grep 'svc.marriage-relation' | awk '{print $1}') bash
}

function run.web {
    docker-compose kill server
    docker-compose up server
}
