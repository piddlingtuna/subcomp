# subcomp

This is a project submission system for [CSESoc](https://csesoc.unsw.edu.au/)'s Personal Project Competition. It was written and first used in 2020 will no longer be maintained by it's [original committer](https://github.com/piddlingtuna/subcomp/).

## Authentication

This project only lets users sign up using a [UNSW](https://www.unsw.edu.au/) zID. It does not hook into UNSW's authentication system, but instead verifies users by emailing their UNSW email address based on their zID. This is done when verifying users when they sign up and reseting users' password when requested.

## Environment variables

A `.env` file must exist in this directory if you are using docker. It must contain:

- `POSTGRES_USER` = the name of a user in the database. It must have permission to read/write to the database.
- `POSTGRES_PASSWORD` = the password of the above user.
- `POSTGRES_DB` = the name of the database.

An example `.env` would look like:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=subcomp
```

## Set Up

See the guide [here](set_up.md)
