CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    updated_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    link TEXT NOT NULL,
    repo TEXT NOT NULL
);

SELECT diesel_manage_updated_at('projects');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    updated_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    zid CHAR(8) UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash BYTEA NOT NULL,
    project_id UUID references projects(id)
);

SELECT diesel_manage_updated_at('users');
CREATE UNIQUE INDEX zidx ON users(zid);

CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    updated_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    token CHAR(32) UNIQUE NOT NULL,
    user_id UUID NOT NULL references users(id)
);

SELECT diesel_manage_updated_at('tokens');
CREATE UNIQUE INDEX tokenx ON tokens(token);

CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    user_id UUID NOT NULL references users(id),
    project_id UUID NOT NULL references projects(id)
);
