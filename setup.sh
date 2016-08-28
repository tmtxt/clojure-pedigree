#!/usr/bin/env sh

ansible-playbook -i "localhost," -c local --extra-vars "{\"project_dir\": \"$PWD\"}" ansible/main.yml
