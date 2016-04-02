#!/usr/bin/env bash

cd {{ project_dir }}
docker-compose run svc.models.run npm install
