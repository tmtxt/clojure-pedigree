#!/usr/bin/env bash

cd {{ project_dir }}/web
sudo docker exec -it $(sudo docker-compose ps | grep 'schemup' | awk '{print $1}') schemup commit
