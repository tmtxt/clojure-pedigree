#!/usr/bin/env bash

cd {{ project_dir }}
docker exec -it $(docker-compose ps | grep 'postgres' | awk '{print $1}') bash
