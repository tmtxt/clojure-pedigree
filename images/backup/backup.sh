#!/usr/bin/env bash

DIRS=(
    "/data"
    "/app-data"
    "/var/lib/postgresql/data"
)

echo "Creating zip file"

FILENAME=/backup/$(date +%Y-%m-%d-%H-%M-%S).zip

for dir in ${DIRS[@]}; do
    zip -ru9 $FILENAME $dir
done

echo "Zip file created at $FILENAME"
