#!/usr/bin/env bash

cd {{ project_dir }}
docker-compose run frontend npm install --no-bin-links
