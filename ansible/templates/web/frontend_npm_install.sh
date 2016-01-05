#!/usr/bin/env bash

cd {{ project_dir }}
sudo docker-compose run frontend npm install --no-bin-links
