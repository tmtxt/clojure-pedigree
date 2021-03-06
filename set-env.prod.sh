#!/usr/bin/env sh

# aliases
alias dcu="docker-compose -f docker-compose.yml -f docker-compose.prod.yml up"
alias dcud="docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
alias dcp="docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps"
alias dcr="docker-compose -f docker-compose.yml -f docker-compose.prod.yml rm"
alias dcl="docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
alias dcb="docker-compose -f docker-compose.yml -f docker-compose.prod.yml build"
alias dck="docker-compose -f docker-compose.yml -f docker-compose.prod.yml kill"
alias gs="docker-compose run dev.frontend gulp setup"
alias gd="docker-compose run dev.frontend gulp dev"
alias gp="docker-compose run dev.frontend gulp prod"
alias gw="docker-compose run dev.frontend gulp watch"

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
