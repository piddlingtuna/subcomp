use core::fmt;

use diesel_derive_enum::DbEnum;
use rocket::request::FromFormValue;
use serde_derive::Deserialize;

#[derive(DbEnum, Debug, Clone, Copy, FromFormValue, Deserialize, PartialEq)]
#[DbValueStyle = "PascalCase"]
pub enum Category {
    Web,
    Mobile,
    Other,
    Game,
}

impl fmt::Display for Category {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

table! {
    use diesel::sql_types::*;
    use super::CategoryMapping;

    projects (id) {
        id -> Uuid,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        title -> Text,
        summary -> Text,
        link -> Text,
        repo -> Text,
        firstyear -> Bool,
        category -> CategoryMapping,
    }
}

table! {
    resets (id) {
        id -> Uuid,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        token -> Bpchar,
        user_id -> Uuid,
    }
}

table! {
    tokens (id) {
        id -> Uuid,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        token -> Bpchar,
        user_id -> Uuid,
    }
}

table! {
    users (id) {
        id -> Uuid,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        zid -> Bpchar,
        name -> Text,
        password_hash -> Bytea,
        project_id -> Nullable<Uuid>,
    }
}

table! {
    verifications (id) {
        id -> Uuid,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        token -> Bpchar,
        zid -> Bpchar,
        name -> Text,
        password_hash -> Bytea,
    }
}

table! {
    votes (id) {
        id -> Uuid,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        user_id -> Uuid,
        project_id -> Uuid,
    }
}

joinable!(resets -> users (user_id));
joinable!(tokens -> users (user_id));
joinable!(users -> projects (project_id));
joinable!(votes -> projects (project_id));
joinable!(votes -> users (user_id));

allow_tables_to_appear_in_same_query!(projects, resets, tokens, users, verifications, votes,);
