#!/usr/bin/env bash

cd {{ project_dir }}
docker exec -it $(docker-compose ps | grep 'schemup' | awk '{print $1}') bash
