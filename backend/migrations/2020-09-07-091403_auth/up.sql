CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    updated_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    link TEXT NOT NULL,
    repo TEXT NOT NULL,
    first_year BOOLEAN DEFAULT FALSE NOT NULL, 
    postgraduate BOOLEAN DEFAULT FALSE NOT NULL
);

SELECT diesel_manage_updated_at('projects');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    updated_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    zid CHAR(8) UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash BYTEA NOT NULL,
    project_id UUID DEFAULT NULL references projects(id)
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

CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    updated_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    token CHAR(32) UNIQUE NOT NULL,
    zid CHAR(8) NOT NULL,
    full_name TEXT NOT NULL,
    password_hash BYTEA NOT NULL
);

SELECT diesel_manage_updated_at('verifications');
CREATE UNIQUE INDEX verificationx ON verifications(token);

CREATE TABLE resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    updated_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    token CHAR(32) UNIQUE NOT NULL,
    user_id UUID NOT NULL references users(id)
);

SELECT diesel_manage_updated_at('resets');
CREATE UNIQUE INDEX resetx ON resets(token);

CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    updated_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    user_id UUID NOT NULL references users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL references projects(id) ON DELETE CASCADE
);

SELECT diesel_manage_updated_at('votes');
