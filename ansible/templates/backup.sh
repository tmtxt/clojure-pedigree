#!/usr/bin/env bash

CURRENT_TIME="$(date +%Y-%m-%d-%H-%M-%S)"
FILE_EXT="zip"
FILE_NAME="{{ project_dir }}/backup/backup-on-$CURRENT_TIME.$FILE_EXT"

DIRS=(
    "{{ log_dir }}"
    "{{ password_dir }}"
    "{{ person_image_dir }}"
)

for path in "${DIRS[@]}"
do
    dir=$(basename $path)
    cd $path/..
    zip -r -u $FILE_NAME $dir
done
