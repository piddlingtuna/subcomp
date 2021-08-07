# syntax=docker/dockerfile:1
FROM rust:latest
WORKDIR /backend
COPY . .
RUN rustup default nightly
RUN cargo build --release
RUN cargo install diesel_cli --no-default-features --features postgres
CMD diesel setup && diesel migration run && ./target/release/backend
