#!/usr/bin/env sh

ansible-playbook -i "localhost," -c local ansible/main.yml
