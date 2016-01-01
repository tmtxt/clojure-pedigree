#!/usr/bin/env bash

cd {{ project_dir }}
sudo docker exec -it $(sudo docker-compose ps | grep 'postgres' | awk '{print $1}') bash
