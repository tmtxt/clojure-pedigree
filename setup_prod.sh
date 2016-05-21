#!/usr/bin/env sh

ansible-playbook -i "localhost," -c local --extra-vars '{"project_dir": "/home/pedigree/clojure-pedigree"}' --tags "prod" ansible/main.yml
