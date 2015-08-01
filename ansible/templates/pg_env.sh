#!/bin/sh

export DB_HOST={{db_host}}
export DB_NAME={{db_name}}
export DB_USER={{db_user}}
export DB_PASS={{db_password}}
export DB_PORT=5432

export PGDATABASE=$DB_NAME
export PGHOST=$DB_HOST
export PGUSER=$DB_USER
export PGPASSWORD=$DB_PASS
export PGPORT=$DB_PORT
