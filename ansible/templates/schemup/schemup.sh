#!/usr/bin/env bash

cd {{ project_dir }}
docker-compose run schemup schemup commit
