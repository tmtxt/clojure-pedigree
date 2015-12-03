# 1. Vagrant Provision

Everything is set up already for Vagrant, just one command and you're done

```
$ vagrant provision
```

# 2. Production deployment

## Preparation

Edit variables to overwrite in `ansible/host_vars` and use `ansible/run.sh` script

# Variables

You must overwrite these variables on server

- `project_name`: the short unique name of project, default to **pedigree**
- `project_dir`: real path to the project

These variables can be optionally overwritten

- `project_user`: the user to run the project, default to `project_name`
- `db_name`: name of database to create, default to `project_name`
- `db_user`: the user to grant access to database, default to `project_user`
- `db_host`: default to **localhost**
- `service_prefix`: the prefix of the upstart service, default to `project_name`

For other variables, open `ansible/roles` and look into each role, there will be
detailed information about what variables can be overwritten. You can also
adjust the variables for the project in `ansible/group_vars` or `ansible/host_vars`.
