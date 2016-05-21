#!/usr/bin/env sh

# aliases
alias dcu="docker-compose -f docker-compose.yml -f docker-compose.prod.yml up"
alias dcud="docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
alias dcp="docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps"
alias dcr="docker-compose -f docker-compose.yml -f docker-compose.prod.yml rm"
alias dcl="docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
alias dcb="docker-compose -f docker-compose.yml -f docker-compose.prod.yml build"

function attach {
    docker exec -it $(docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps | grep "$1" | awk '{print $1}') /bin/bash
}

function kill_and_run {
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml kill $1
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up $1
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

function svc.api-tree {
    kill_and_run "svc.api-tree"
}

function backup {
    docker-compose -f docker-compose.yml -f docker-compose.backup.yml run backup /backup.sh
}

function restore {
    docker-compose -f docker-compose.yml -f docker-compose.backup.yml run backup /restore.sh
}
