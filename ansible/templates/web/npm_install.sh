#!/usr/bin/env bash

cd {{ project_dir }}
sudo docker exec -it $(sudo docker-compose ps | grep 'frontend' | awk '{print $1}') npm install --no-bin-links
