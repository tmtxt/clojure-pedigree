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

# # Copy back the directory to there destination
# # log dir
# rm -rf /vagrant/logs
# cp -R $TEMP_DIR/backup/logs /vagrant/logs
# # password dir
# rm -rf /vagrant/password
# cp -R $TEMP_DIR/backup/password /vagrant/password
# # person image dir
# rm -rf /vagrant/resources/public/person-image
# cp -R $TEMP_DIR/backup/person-image /vagrant/resources/public/person-image
# # neo4j dir
# rm -rf ~/neo4j
# cp -R $TEMP_DIR/backup/neo4j ~/neo4j
