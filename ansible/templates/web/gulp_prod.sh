#!/usr/bin/env bash

cd {{ project_dir }}
docker-compose run frontend gulp prod
