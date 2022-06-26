# syntax=docker/dockerfile:1
FROM rust:latest
WORKDIR /backend
COPY . .
RUN rustup default nightly
RUN cargo install diesel_cli --no-default-features --features postgres
# RUN cargo build --release
# CMD diesel setup && ./target/release/backend
RUN cargo build
CMD diesel setup && ./target/debug/backend
