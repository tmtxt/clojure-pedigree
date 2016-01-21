#!/usr/bin/env bash

cd {{ project_dir }}
docker exec -it $(docker-compose ps | grep 'neonode' | awk '{print $1}') bash
