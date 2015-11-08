Models are defined in `src/app/models`. Model files use
[Korma](http://sqlkorma.com/docs) by default (but you can you whatever ORM that
you want, just include the dependencies in `project.clj`).

To generate a basic model file

```
$ lein run -m command.modelgen --name NAME --table TABLE --primary-key PK
```

- NAME: name of the model to generate (compulsory)
- TABLE: the corresponding table (optionally, default to NAME)
- PK: the primary key column (optionally, default to `id`)
