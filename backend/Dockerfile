FROM clux/muslrust:nightly AS chef
USER root
RUN cargo install cargo-chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
# musl!
RUN cargo chef cook --release --target x86_64-unknown-linux-musl --recipe-path recipe.json
COPY . .
RUN cargo build --release --target x86_64-unknown-linux-musl --bin backend

FROM clux/diesel-cli
RUN addgroup -S subcomp && adduser -S subcomp -G subcomp
COPY . .
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/backend .

USER subcomp
CMD diesel setup && ./backend