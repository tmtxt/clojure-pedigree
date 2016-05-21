#!/usr/bin/env bash

DIRS=(
    "/data"
    "/app-data"
    "/var/lib/postgresql/data"
)

echo "Extracting zip file"

FILENAME=/backup/$(ls /backup | tail -n 1)

unzip $FILENAME -d /backup/temp

echo "Start moving file back to its place"

for dir in ${DIRS[@]}; do
    rm -rf $dir/*
    cp -r /backup/temp$dir/* $dir/
done

echo "Delete temp folder"

rm -rf /backup/temp

echo "Done!";
