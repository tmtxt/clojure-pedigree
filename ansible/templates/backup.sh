#!/usr/bin/env bash

# Create temp folder
TEMP_DIR="{{ project_dir }}/temp"
BACKUP_DIR=$TEMP_DIR/backup
mkdir -p $TEMP_DIR
rm -rf $BACKUP_DIR
mkdir -p $BACKUP_DIR

# Backup file name
CURRENT_TIME="$(date +%Y-%m-%d-%H-%M-%S)"
FILE_EXT="zip"
FILE_NAME="{{ project_dir }}/backup/backup-on-$CURRENT_TIME.$FILE_EXT"

# folders to backup
declare -A DIRS=(
    [logs]={{ log_dir }}
    [password]={{ password_dir }}
    [person-image]={{ person_image_dir }}
    [neo4j]={{ neo4j_path }}
)

# create zip structure
for k in "${!DIRS[@]}"; do
    mkdir $BACKUP_DIR/$k
    cp -R ${DIRS[$k]}/* $BACKUP_DIR/$k
done

# Backup postgres database
export PGDATABASE={{ db_name }}
export PGHOST={{ db_host }}
export PGUSER={{ db_user }}
export PGPASSWORD={{ db_password }}
export PGPORT=5432

mkdir -p $BACKUP_DIR/postgres
cd $BACKUP_DIR/postgres
pg_dump -cO > postgres.sql

# create zip file
cd $BACKUP_DIR
for dir_path in $BACKUP_DIR/*; do
    dir=$(basename "$dir_path")
    zip -r -u $FILE_NAME $dir
done

# remove temp backup dir
rm -rf $BACKUP_DIR
