#!/usr/bin/env sh

ansible-playbook -K -i hosts -e "@extra_vars.yml" main.yml
