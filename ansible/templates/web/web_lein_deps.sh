#!/usr/bin/env bash

cd {{ project_dir }}
docker-compose run server lein deps
