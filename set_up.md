## Set Up

Please read the sections on environment variables in `backend/README.md` and `frontend/README.md`.

## Supporting operating systems

This guide supports MacOS, Debian Linux, and Arch Linux. However, it has only been fully tested on Arch Linux.

If you are using Windows, [please install Linux with the Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install).

## Install dependencies

Install Rust by follwing [these instructions](https://www.rust-lang.org/tools/install).

Install Node by following [these instructions](https://nodejs.org/en/download/).

Install PostgreSQL by following [these instructions](https://www.postgresql.org/download/).

## Set Up PostgreSQL

Start the PostgreSQL service on every boot:

```
sudo systemctl enable postgresql
```

Start the PostgreSQL service:

```
sudo systemctl start postgresql
```

Later, you can disable starting the PostgreSQL service on every boot:

```
sudo systemctl disable postgresql
```

Create a password for the `postgres` user:

```
sudo -u postgres psql
postgres=# \password postgres
[Enter a strong password]
postgres#= \q
```

Create a database:

```
createdb subcomp
```

## Run the backend

Thanks to `rocket`, we use nightly Rust. Thus, you must run:

```
rustup default nightly
```

Ensure you have added a `backend/.env` file as described in `backend/README.md`.

### Development

Navigate to `backend` in your terminal and run:

```
cargo build
cargo install diesel_cli --no-default-features --features postgres
diesel setup
cargo run
```

You can subsequently run the backend using:

```
cargo run
```

If you want to restart the backend after every code change, install `cargo watch`:

```
cargo install cargo-watch
```

You can subsequently run the backend using:

```
cargo watch -x run
```

### Production

Navigate to `backend` in your terminal and run:

```
cargo install diesel_cli --no-default-features --features postgres
diesel setup
cargo build --release
./target/release/backend
```

## Run the frontend

Ensure you have added a `frontend/.env` file as described in `frontend/README.md`.

### Development

Navigate to `frontend` in your terminal and run:

```
yarn install
yarn start
```

You can subsequently run the backend using:

```
yarn start
```

### Production

Navigate to `frontend` in your terminal and run:

```
yarn install --production
yarn build --production
yarn serve -s build
```

## Docker

As an alternative to all the above steps, you can use docker.

### Installing dependencies

Install `docker` by following [these instructions](https://docs.docker.com/get-docker/).

Install `docker compose` by [following these instructions](https://docs.docker.com/compose/install/).

### Running the backend and frontend

Please read the sections on environment variables in `README.md`, `backend/README.md`, and `frontend/README.md`.

Please change `localhost` to `database` in `backend/.env`.

```
sudo docker compose up # This will take a long time.
sudo docker compose build
```
