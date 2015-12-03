# The pdc command script

This is a small script for running app commands (under `command` namespace).

```
$ ./pdc {command-name} {args}
```

# Model generation

To generate a basic model file

```
$ ./pdc modelgen --name NAME --table TABLE --primary-key PK
```

- NAME: name of the model to generate (compulsory)
- TABLE: the corresponding table (optionally, default to NAME)
- PK: the primary key column (optionally, default to `id`)
