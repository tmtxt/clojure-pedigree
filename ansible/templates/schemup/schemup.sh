#!/usr/bin/env bash

cd {{ project_dir }}
sudo docker-compose run schemup schemup commit
