use std::env;
use rocket::request::{self, FromRequest, Request};
use rocket::http::Status;
use rocket::Outcome;
use diesel::prelude::*;
use diesel::pg::PgConnection;
use uuid::Uuid;
use chrono::NaiveDateTime;
use rand::{Rng, thread_rng};
use rand::distributions::Alphanumeric;
use argon2rs::argon2i_simple;

use crate::database::Conn;
use crate::schema::{projects, users, tokens, verifications, resets, votes};
use crate::schema::projects::dsl::projects as all_projects;
use crate::schema::users::dsl::users as all_users;
use crate::schema::tokens::dsl::tokens as all_tokens;
use crate::schema::verifications::dsl::verifications as all_verifications;
use crate::schema::resets::dsl::resets as all_resets;
use crate::schema::votes::dsl::votes as all_votes;

#[derive(Queryable)]
pub struct Project {
    pub id: Uuid,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub title: String,
    pub summary: String,
    pub link: String,
    pub repo: String,
    pub firstyear: bool,
    pub postgrad: bool,}

#[derive(Insertable)]
#[table_name = "projects"]
pub struct NewProject {
    pub title: String,
    pub summary: String,
    pub link: String,
    pub repo: String,
    pub firstyear: bool,
    pub postgrad: bool,
}

impl Project {
    pub fn get_all(conn: &PgConnection) -> Vec<Project> {
        all_projects
            .order(projects::id.desc())
            .load::<Project>(conn)
            .unwrap_or_else(|_| Vec::new())
    }

    pub fn get_zids_from_id(id: &Uuid, conn: &PgConnection) -> Vec<String> {
        all_users
            .filter(users::project_id.eq(id))
            .select(users::zid)
            .load::<String>(conn)
            .unwrap_or_else(|_| Vec::new())
    }

    pub fn get_zids(&self, conn: &PgConnection) -> Vec<String> {
        all_users
            .filter(users::project_id.eq(self.id))
            .select(users::zid)
            .load::<String>(conn)
            .unwrap_or_else(|_| Vec::new())
    }

    pub fn get_names(&self, conn: &PgConnection) -> Vec<String> {
        all_users
            .filter(users::project_id.eq(self.id))
            .select(users::name)
            .load::<String>(conn)
            .unwrap_or_else(|_| Vec::new())
    }

    pub fn count_votes(&self, conn: &PgConnection) -> i64 {
        all_votes
            .filter(votes::project_id.eq(self.id))
            .count()
            .get_result(conn)
            .unwrap_or(0)
    }

    pub fn insert(title: &str, summary: &str, link: &str, repo: &str, firstyear: bool, postgrad: bool, conn: &PgConnection) -> Option<Project> {
        let new_project = NewProject {
            title: title.to_string(),
            summary: summary.to_string(),
            link: link.to_string(),
            repo: repo.to_string(),
            firstyear,
            postgrad,
        };
        match diesel::insert_into(projects::table)
            .values(&new_project)
            .get_result(conn) {
                Ok(project) => Some(project),
                Err(_) => None,
            }
    }

    pub fn edit(id: &Uuid, title: &str, summary: &str, link: &str, repo: &str, firstyear: bool, postgrad: bool, conn: &PgConnection) -> Option<Project> {
        match diesel::update(projects::table.find(id))
            .set((
                projects::title.eq(title),
                projects::summary.eq(summary),
                projects::repo.eq(repo),
                projects::link.eq(link),
                projects::firstyear.eq(firstyear),
                projects::postgrad.eq(postgrad),
            ))
            .get_result(conn) {
                Ok(project) => Some(project),
                Err(_) => None,
            }
    }

    pub fn delete(id: &Uuid, conn: &PgConnection) -> bool {
        diesel::delete(projects::table.find(id))
            .execute(conn)
            .is_ok()
    }
}

#[derive(Queryable)]
pub struct User {
    pub id: Uuid,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub zid: String,
    pub name: String,
    pub password_hash: Vec<u8>,
    pub project_id: Option<Uuid>
}

#[derive(Insertable)]
#[table_name = "users"]
pub struct NewUser {
    pub zid: String,
    pub name: String,
    pub password_hash: Vec<u8>,
}

impl User {
    /// Hash `password` using argon2 and return it.
    fn generate_password_hash(password: &str) -> Vec<u8> {
        let password_salt = env::var("PASSWORD_SALT").expect("PASSWORD_SALT must be set in env");
        argon2i_simple(password, &password_salt).to_vec()
    }
    
    /// Verify that `candidate_password` matches the stored password.
    pub fn verify_password(&self, password: &str) -> bool {
        let password_salt = env::var("PASSWORD_SALT").expect("PASSWORD_SALT must be set in env");
        self.password_hash == argon2i_simple(password, &password_salt).to_vec()
    }

    pub fn exists_by_zid(zid: &str, conn: &PgConnection) -> bool {
        all_users
            .filter(users::zid.eq(zid))
            .first::<User>(conn)
            .is_ok()
    }

    pub fn get_by_id(id: &Uuid, conn: &PgConnection) -> Option<User> {
        match all_users
            .find(id)
            .first::<User>(conn) {
                Ok(user) => Some(user),
                Err(_) => None,
            }
    }

    pub fn zid_doing_project(zid: &str, project_id: &Uuid, conn: &PgConnection) -> bool {
        let id = match all_users
            .filter(users::zid.eq(zid))
            .select(users::project_id)
            .first::<Option<Uuid>>(conn) {
                Ok(id) => (id),
                Err(_) => return false,
            };

        id == Some(*project_id)
    }

    pub fn zid_can_do_project(zid: &str, conn: &PgConnection) -> bool {
        let id = match all_users
            .filter(users::zid.eq(zid))
            .select(users::project_id)
            .first::<Option<Uuid>>(conn) {
                Ok(id) => id,
                Err(_) => return false,
            };

        id == None
    }

    pub fn zid_do_project(zid: &str, project_id: &Uuid, conn: &PgConnection) -> bool {
        diesel::update(all_users.filter(users::zid.eq(zid)))
            .set(users::project_id.eq(project_id))
            .execute(conn)
            .is_ok()
    }

    pub fn zid_not_do_project(zid: &str, conn: &PgConnection) -> bool {
        let none: Option<Uuid> = None;

        diesel::update(all_users.filter(users::zid.eq(zid)))
            .set(users::project_id.eq(none))
            .execute(conn)
            .is_ok()
    }

    pub fn get_by_zid(zid: &str, conn: &PgConnection) -> Option<User> {
        match all_users
            .filter(users::zid.eq(zid))
            .first::<User>(conn) {
                Ok(user) => Some(user),
                Err(_) => None,
            }
    }

    pub fn insert(zid: &str, name: &str, password_hash: &[u8], conn: &PgConnection) -> Option<User> {
        let new_user = NewUser {
            zid: zid.to_string(),
            name: name.to_string(),
            password_hash: password_hash.to_owned(),
        };

        match diesel::insert_into(users::table)
            .values(&new_user)
            .get_result(conn) {
                Ok(user) => Some(user),
                Err(_) => None,
            }
    }

    pub fn generate_token(&self, conn: &PgConnection) -> Option<Token> {
        let token = thread_rng()
            .sample_iter(&Alphanumeric)
            .take(32)
            .collect::<String>();

        let new_token = NewToken {
            token,
            user_id: self.id
        };

        match diesel::insert_into(tokens::table)
            .values(&new_token)
            .get_result(conn) {
                Ok(token) => Some(token),
                Err(_) => None,
            }
    }

    pub fn change_name(&self, name: &str, conn: &PgConnection) -> bool {
        diesel::update(users::table.find(self.id))
            .set(users::name.eq(name))
            .execute(conn)
            .is_ok()
    }

    pub fn change_password(&self, password: &str, conn: &PgConnection) -> bool {
        let password_hash = User::generate_password_hash(password);

        diesel::update(users::table.find(self.id))
            .set(users::password_hash.eq(password_hash))
            .execute(conn)
            .is_ok()
    }

    pub fn get_project(&self, conn: &PgConnection) -> Option<Uuid> {
        match all_users
            .find(self.id)
            .select(users::project_id)
            .first::<Option<Uuid>>(conn) {
                Ok(project_id) => project_id,
                Err(_) => None,
            }

    }

    pub fn get_votes(&self, conn: &PgConnection) -> Vec<Uuid> {
        all_votes
            .filter(votes::user_id.eq(self.id))
            .select(votes::project_id)
            .load::<Uuid>(conn)
            .unwrap_or_else(|_| Vec::new())
    }

    pub fn count_votes(&self, conn: &PgConnection) -> i64 {
        all_votes
            .filter(votes::user_id.eq(self.id))
            .count()
            .get_result(conn)
            .unwrap_or(0)
    }

    pub fn vote(&self, project_id: &Uuid, conn: &PgConnection) -> bool {
        let vote = NewVote {
            user_id: self.id,
            project_id: *project_id
        };

        diesel::insert_into(votes::table)
            .values(&vote)
            .execute(conn)
            .is_ok()
    }

    pub fn unvote(&self, project_id: &Uuid, conn: &PgConnection) -> bool {
        diesel::delete(votes::table)
            .filter(votes::user_id.eq(self.id))
            .filter(votes::project_id.eq(project_id))
            .execute(conn)
            .is_ok()
    }
}

impl<'a, 'r> FromRequest<'a, 'r> for User {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<User, ()> {
        let conn = &<Conn as FromRequest>::from_request(request)?;
        let keys: Vec<_> = request.headers().get("Authorization").collect();
        if keys.len() != 1 {
            return Outcome::Failure((Status::BadRequest, ()));
        };

        let token = match Token::get_by_token(keys[0], conn) {
            Some(token) => token,
            None => return Outcome::Failure((Status::Unauthorized, ())),
        };

        match token.get_user(conn) {
            Some(user) => Outcome::Success(user),
            None => Outcome::Failure((Status::BadRequest, ())),
        }
    }
}

#[derive(Queryable)]
pub struct Token {
    pub id: Uuid,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub token: String,
    pub user_id: Uuid,
}

#[derive(Insertable)]
#[table_name = "tokens"]
pub struct NewToken {
    pub token: String,
    pub user_id: Uuid,
}

impl Token {
    pub fn get_by_token(token: &str, conn: &PgConnection) -> Option<Token> {
        match all_tokens
            .filter(tokens::token.eq(token))
            .first::<Token>(conn) {
                Ok(token) => Some(token),
                Err(_) => None,
            }
    }

    pub fn get_user(&self, conn: &PgConnection) -> Option<User> {
        match all_users
            .find(self.user_id)
            .first::<User>(conn) {
            Ok(user) => Some(user),
            Err(_) => None,
        }
    }

    pub fn delete(&self, conn: &PgConnection) -> bool {
        diesel::delete(tokens::table.find(self.id))
            .execute(conn)
            .is_ok()
    }
}

impl<'a, 'r> FromRequest<'a, 'r> for Token {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<Token, ()> {
        let conn = &<Conn as FromRequest>::from_request(request)?;
        let keys: Vec<_> = request.headers().get("Authorization").collect();
        if keys.len() != 1 {
            return Outcome::Failure((Status::BadRequest, ()));
        };

        let token = keys[0];

        match Token::get_by_token(token, conn) {
            Some(token) => Outcome::Success(token),
            None => Outcome::Failure((Status::Unauthorized, ())),
        }
    }
}

#[derive(Queryable)]
pub struct Verification {
    pub id: Uuid,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub token: String,
    pub zid: String,
    pub name: String,
    pub password_hash: Vec<u8>,
}

#[derive(Insertable)]
#[table_name = "verifications"]
pub struct NewVerification {
    pub token: String,
    pub zid: String,
    pub name: String,
    pub password_hash: Vec<u8>,
}

impl Verification {
    pub fn insert(zid: &str, name: &str, password: &str, conn: &PgConnection) -> Option<Verification> {
        let token = thread_rng()
            .sample_iter(&Alphanumeric)
            .take(32)
            .collect::<String>();

        let password_hash = User::generate_password_hash(password);

        let new_verification = NewVerification {
            token,
            zid: zid.to_string(),
            name: name.to_string(),
            password_hash,
        };

        match diesel::insert_into(verifications::table)
            .values(&new_verification)
            .get_result(conn) {
                Ok(verification) => Some(verification),
                Err(_error) => None,
            }
    }

    pub fn delete(&self, conn: &PgConnection) -> bool {
        diesel::delete(verifications::table.find(self.id))
            .execute(conn)
            .is_ok()
    }

    pub fn get_by_token(token: &str, conn: &PgConnection) -> Option<Verification> {
        match all_verifications
            .filter(verifications::token.eq(token))
            .first::<Verification>(conn) {
            Ok(verification) => Some(verification),
            Err(_) => None,
        }
    }
}

#[derive(Queryable)]
pub struct Reset {
    pub id: Uuid,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub token: String,
    pub user_id: Uuid,
}

#[derive(Insertable)]
#[table_name = "resets"]
pub struct NewReset {
    pub token: String,
    pub user_id: Uuid,
}

impl Reset {
    pub fn insert(zid: &str, conn: &PgConnection) -> Option<Reset> {
        let user = match User::get_by_zid(zid, conn) {
            Some(user) => user,
            None => return None,
        };

        let token = thread_rng()
            .sample_iter(&Alphanumeric)
            .take(32)
            .collect::<String>();
        
        let new_reset = NewReset {
            token,
            user_id: user.id,
        };

        match diesel::insert_into(resets::table)
            .values(&new_reset)
            .get_result(conn) {
                Ok(reset) => Some(reset),
                Err(_) => None,
            }
    }

    pub fn delete(&self, conn: &PgConnection) -> bool {
        diesel::delete(resets::table.find(self.id))
            .execute(conn)
            .is_ok()
    }

    pub fn get_by_token(token: &str, conn: &PgConnection) -> Option<Reset> {
        match all_resets
        .filter(resets::token.eq(token))
            .first::<Reset>(conn) {
            Ok(reset) => Some(reset),
            Err(_) => None,
        }
    }

    pub fn get_user(&self, conn: &PgConnection) -> Option<User> {
        match all_users
            .find(self.user_id)
            .first::<User>(conn) {
            Ok(user) => Some(user),
            Err(_) => None,
        }
    }
}

#[derive(Queryable)]
pub struct Vote {
    pub id: Uuid,
    pub created_at: NaiveDateTime,
    pub user_id: Uuid,
    pub project_id: Uuid,
}

#[derive(Insertable)]
#[table_name = "votes"]
pub struct NewVote {
    pub user_id: Uuid,
    pub project_id: Uuid,
}

impl Vote {
    pub fn exists(user_id: &Uuid, project_id: &Uuid, conn: &PgConnection) -> bool {
        all_votes
            .filter(votes::user_id.eq(user_id))
            .filter(votes::project_id.eq(project_id))
            .count()
            .get_result(conn)
            .unwrap_or(0) > 0
    }
}
