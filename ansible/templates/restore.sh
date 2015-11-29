#!/usr/bin/env bash

# Create temp folder
TEMP_DIR="{{ project_dir }}/temp"
RESTORE_DIR=$TEMP_DIR/restore
mkdir -p $TEMP_DIR
rm -rf $RESTORE_DIR
mkdir -p $RESTORE_DIR

# Unzip the archive
unzip $1 -d $RESTORE_DIR

# folders to restore
declare -A DIRS=(
    [logs]={{ log_dir }}
    [password]={{ password_dir }}
    [person-image]={{ person_image_dir }}
    [neo4j]={{ neo4j_path }}
)

# copy back folders
for k in "${!DIRS[@]}"; do
    rm -rf ${DIRS[$k]}/*
    cp -R $RESTORE_DIR/$k/* ${DIRS[$k]}/
done

# restore postgres db
export PGDATABASE={{ db_name }}
export PGHOST={{ db_host }}
export PGUSER={{ db_user }}
export PGPASSWORD={{ db_password }}
export PGPORT=5432

cd $RESTORE_DIR/postgres
psql < postgres.sql

# remove restore dir
rm -rf $RESTORE_DIR
