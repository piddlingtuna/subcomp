## Set Up

Note the following instructions have only been fully tested on Arch Linux.


THIS IS STILL UNDER CONSTRUCTION


## Setting Up

1. Install dependencies

    1. Install Rust

    The source of truth is https://www.rust-lang.org/tools/install.

    ### Windows

    See https://forge.rust-lang.org/infra/other-installation-methods.html.

    ### MacOS, Debian Linux, Arch Linux

    ```
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```


    2. Install Node

    The source of truth is https://nodejs.org/en/download/.

    # Windows

    See the source of truth.

    ## MacOS

    ```
    brew install node
    ```

    ### Debian Linux

    See: https://github.com/nodesource/distributions/blob/master/README.md

    ### Arch Linux

    ```
    pacman -S nodejs npm
    ```


    3. Install PostgreSQL

    The source of truth is https://www.postgresql.org/download/.

    ### Windows

    See: https://www.postgresql.org/download/windows/

    ### MacOS

    ```
    brew install postgresql
    ```

    ### Debian Linux

    ```
    sudo apt install postgresql postgresql-client
    ```

    ### Arch Linux
    
    ```
    pacman -S postgresql
    ```


2. Start PostgreSQL

    ### Arch Linux

    Switch to the `postgres` user and initialize the database cluster.

    ```
    sudo -u postgres –i  initdb -D '/var/lib/postgres/data'
    ```

    Exit the `postgres` user.
    
    ```
    exit
    ```

    Start the PostgreSQL service on every boot.
    
    ```
    sudo systemctl enable postgresql
    ```

    Start the PostgreSQL service.

    ```
    sudo systemctl start postgresql
    ```

    You can disable the starting the PostgreSQL service on every boot using:

    ```
    sudo systemctl disable postgresql
    ```


3. Create database

    Create a password for the `postgres` user.

    ```
    sudo -u postgres psql
    postgres=# \password postgres
    [Enter a strong password]
    postgres#= \q
    ```

    Create a database

    ```
    createdb subcomp
    ```


4. Add secrets to .env file

    `$SUBCOMP` represents the working directory of this project.

    ```
    cd $SUBCOMP
    cd backend
    touch .env
    ```

    ### All environments

    Open `.env` and add the following:
    
    ```
    TODO
    ```


4. Build frontend

    The frontend is statically served by the backend. Run these commands every time you want to rebuild the frontend.

    `$SUBCOMP` represents the working directory of this project.

    ```
    cd $SUBCOMP
    cd frontend
    yarn build
    rm -r ../backend/public || true
    mv build ../backend/public
    ```


3. Run backend

    Thanks to `rocket`, we use nightly Rust.

    ### First debug build

    ```
    rustup default nightly
    cargo update
    cargo build
    cargo install diesel_cli --no-default-features --features postgres
    diesel setup
    diesel run migration # CAUTION: This will wipe the database.
    cargo run
    ```

    ### Subsequent debug builds

    ```
    cargo run
    ```

    ### First release build

    ```
    rustup default nightly
    cargo update
    cargo build --release
    cargo install diesel_cli --no-default-features --features postgres
    diesel setup
    diesel run migration # CAUTION: This will wipe the database.
    cargo run --release
    ```

    ### Subsequent release builds

    ```
    cargo run --release
    ```
