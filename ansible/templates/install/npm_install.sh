#!/usr/bin/env bash

cd {{ project_dir }}
docker-compose run svc.person npm install
