use std::env;
use chrono::{DateTime, Duration, Utc};
use rocket_contrib::json;
use rocket_contrib::json::{Json, JsonValue};
use serde_derive::Deserialize;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use uuid::Uuid;
use regex::Regex;

use crate::database::Conn;
use crate::responses::{bad_request, internal_server_error, ok, unauthorized, APIResponse};

use crate::models::{Project, User, Verification, Reset, Token, Vote};

#[get("/projects")]
pub fn projects(
    conn: Conn,
) -> APIResponse {
    let projects:Vec<JsonValue> = Project::get_all(&conn)
        .iter()
        .map(|project|
            json!({
                "id": project.id,
                "title": project.title,
                "summary": project.summary,
                "link": project.link,
                "repo": project.repo,
                "votes": project.count_votes(&conn),
                "zids": project.get_zids(&conn),
                "names": project.get_names(&conn),
        }))
        .collect();
    
    ok().data(json!({
        "projects": projects,
    }))
}

#[get("/user")]
pub fn user(
    user: User,
    conn: Conn,
) -> APIResponse {
    ok().data(json!({
        "user": {
            "zid": user.zid,
            "name": user.name,
            "votes": user.get_votes(&conn),
            "project_id": user.get_project(&conn),
        },
    }))
}

#[derive(Deserialize)]
pub struct GenerateVerificationData {
    pub zid: String,
    pub name: String,
    pub password: String,
}

#[post("/generate_verification", data ="<data>", format = "application/json")]
pub fn generate_verification(
    data: Json<GenerateVerificationData>,
    conn: Conn,
) -> APIResponse {
    let re = Regex::new(r"^z[0-9]{7}$").unwrap();
    if !re.is_match(&data.zid) {
        return bad_request().message("zID is invalid.");
    }

    if data.password.len() < 8 {
        return bad_request().message("Password must be at least 8 characters.");
    }

    if User::exists_by_zid(&data.zid, &conn) {
        return bad_request().message("There is already an account with this zID.");
    }

    let verification = match Verification::insert(&data.zid, &data.name, &data.password, &conn) {
        Some(verification) => verification,
        None => return internal_server_error(),
    };

    let unsw_email = format!("<{}@unsw.edu.au>", &data.zid);
    let domain = env::var("DOMAIN").expect("DOMAIN must be set in env");
    let body = format!("Go to the following link to verify your account for the CSESoc Personal Projects Competition. It will be valid for 1 hour.\n\n{}/verification/{}\n", &domain, &verification.token);

    let email = Message::builder()
        .from("CSESoc <noreply@csesoc.org.au>".parse().unwrap())
        .to(unsw_email.parse().unwrap())
        .subject("Verify your account - DO NOT REPLY")
        .body(body)
        .unwrap();

    let smtp_username = env::var("SMTP_USERNAME").expect("SMTP_USERNAME must be set in env");
    let smtp_password = env::var("SMTP_PASSWORD").expect("SMTP_PASSWORD must be set in env");
    let creds = Credentials::new(smtp_username, smtp_password);

    // Open a remote connection to gmail
    let mailer = SmtpTransport::relay("smtp.gmail.com")
    .unwrap()
    .credentials(creds)
    .build();

    // Send the email
    match mailer.send(&email) {
        Ok(_) => ok(),
        Err(_) => internal_server_error().message("Looks like our code is buggy :("),
    }
}

#[derive(Deserialize)]
pub struct UseVerificationData {
    pub token: String,
}

#[post("/use_verification", data ="<data>", format = "application/json")]
pub fn use_verification(
    data: Json<UseVerificationData>,
    conn: Conn,
) -> APIResponse {
    let verification = match Verification::get_by_token(&data.token, &conn) {
        Some(verification) => verification,
        None => return bad_request().message("Verification token is invalid."),
    };

    // Available for 1 hour
    let expiry_time = verification.created_at + Duration::hours(1);
    if Utc::now().naive_utc() > expiry_time {
        verification.delete(&conn);
        return bad_request().message("Verification token has expired.");
    };

    let user = match User::insert(&verification.zid, &verification.name, &verification.password_hash, &conn) {
        Some(user) => user,
        None => return internal_server_error().message("Looks like our code is buggy :("),
    };

    let token = match user.generate_token(&conn) {
        Some(token) => token,
        None => return internal_server_error().message("Looks like our code is buggy :("),
    };

    if !verification.delete(&conn) {
        return internal_server_error().message("Looks like our code is buggy :(");
    }

    ok().data(json!({
        "token": token.token,
        "user": {
            "zid": user.zid,
            "name": user.name,
            "votes": user.get_votes(&conn),
            "project_id": user.get_project(&conn),
        },
    }))
}

#[derive(Deserialize)]
pub struct LoginData {
    zid: String,
    password: String,
}

#[post("/login", data = "<data>", format = "application/json")]
pub fn login(
    data: Json<LoginData>,
    conn: Conn,
) -> APIResponse {
    let user = match User::get_by_zid(&data.zid, &conn) {
        Some(user) => user,
        None => return unauthorized().message("zID or password is incorrect."),
    };

    if !user.verify_password(&data.password) {
        return unauthorized().message("zID or password is incorrect.");
    }

    let token = match user.generate_token(&conn) {
        Some(token) => token,
        None => return internal_server_error().message("Looks like our code is buggy :("),
    };

    ok().data(json!({
        "token": token.token,
        "user": {
            "zid": user.zid,
            "name": user.name,
            "votes": user.get_votes(&conn),
            "project_id": user.get_project(&conn),
        },
    }))
}

#[get("/logout")]
pub fn logout(
    token: Token,
    conn: Conn,
) -> APIResponse {
    match token.delete(&conn) {
        true => ok(),
        false => internal_server_error().message("Looks like our code is buggy :("),
    }
}

#[derive(Deserialize)]
pub struct ChangeFullNameData {
    pub name: String,
}

#[post("/change_name", data = "<data>", format = "application/json")]
pub fn change_name(
    user: User,
    data: Json<ChangeFullNameData>,
    conn: Conn,
) -> APIResponse {
    match user.change_name(&data.name, &conn) {
        true => ok(),
        false => internal_server_error().message("Looks like our code is buggy :("),
    }
}

#[derive(Deserialize)]
pub struct ChangePasswordData {
    pub password: String,
}

#[post("/change_password", data = "<data>", format = "application/json")]
pub fn change_password(
    user: User,
    data: Json<ChangePasswordData>,
    conn: Conn,
) -> APIResponse {
    match user.change_password(&data.password, &conn) {
        true => ok(),
        false => internal_server_error().message("Looks like our code is buggy :("),
    }
}

#[derive(Deserialize)]
pub struct GenerateResetData {
    pub zid: String,
}

#[post("/generate_reset", data = "<data>", format = "application/json")]
pub fn generate_reset(
    data: Json<GenerateResetData>,
    conn: Conn,
) -> APIResponse {
    let reset = match Reset::insert(&data.zid, &conn) {
        Some(reset) => reset,
        None => return bad_request().message("zID is invalid."),
    };

    let unsw_email = format!("<{}@unsw.edu.au>", &data.zid);
    let domain = env::var("DOMAIN").expect("DOMAIN must be set in env");
    let body = format!("Go to the following link to reset your password for the CSESoc Personal Projects Competition. It will be valid for 1 hour.\n\n{}/reset/{}\n", &domain, &reset.token);

    let email = Message::builder()
        .from("CSESoc <noreply@csesoc.org.au>".parse().unwrap())
        .to(unsw_email.parse().unwrap())
        .subject("Reset your password - DO NOT REPLY")
        .body(body)
        .unwrap();

    let smtp_username = env::var("SMTP_USERNAME").expect("SMTP_USERNAME must be set in env");
    let smtp_password = env::var("SMTP_PASSWORD").expect("SMTP_PASSWORD must be set in env");
    let creds = Credentials::new(smtp_username, smtp_password);

    // Open a remote connection to gmail
    let mailer = SmtpTransport::relay("smtp.gmail.com")
    .unwrap()
    .credentials(creds)
    .build();

    // Send the email
    match mailer.send(&email) {
        Ok(_) => ok(),
        Err(_) => internal_server_error().message("Looks like our code is buggy :("),
    }
}

#[derive(Deserialize)]
pub struct UseResetData {
    pub token: String,
    pub password: String,
}

#[post("/use_reset", data = "<data>", format = "application/json")]
pub fn use_reset(
    data: Json<UseResetData>,
    conn: Conn,
) -> APIResponse {
    let reset = match Reset::get_by_token(&data.token, &conn) {
        Some(reset) => reset,
        None => return bad_request().message("Reset token is invalid."),
    };

    // Available for 1 hour
    let expiry_time = reset.created_at + Duration::hours(1);
    if Utc::now().naive_utc() > expiry_time {
        reset.delete(&conn);
        return bad_request().message("Reset token has expired.");
    };

    let user = match reset.get_user(&conn) {
        Some(user) => user,
        None => return internal_server_error().message("Looks like our code is buggy :("),
    };

    if !user.change_password(&data.password, &conn) {
        return internal_server_error().message("Looks like our code is buggy :(");
    }

    let token = match user.generate_token(&conn) {
        Some(token) => token,
        None => return internal_server_error().message("Looks like our code is buggy :("),
    };

    if !reset.delete(&conn) {
        return internal_server_error().message("Looks like our code is buggy :(");
    }

    ok().data(json!({
        "token": token.token,
        "user": {
            "zid": user.zid,
            "name": user.name,
            "votes": user.get_votes(&conn),
            "project_id": user.get_project(&conn),
        },
    }))
}

#[derive(Deserialize)]
pub struct VoteData {
    pub project_id: Uuid,
}

#[post("/vote", data = "<data>", format = "application/json")]
pub fn vote(
    user: User,
    data: Json<VoteData>,
    conn: Conn,
) -> APIResponse {
    let vote_end = env::var("VOTE_END").expect("VOTE_END must be set in env");
    let end = DateTime::parse_from_rfc3339(&vote_end).expect("VOTE_END uses rfc3339 format.");

    if end < Utc::now() {
        return bad_request().message("Vote deadline is over.");
    }

    if user.count_votes(&conn) >= 3 {
        return bad_request().message("You already have 3 votes.");
    }

    if Vote::exists(&user.id, &data.project_id, &conn) {
        return bad_request().message("You have already voted for this project.");
    }

    match user.vote(&data.project_id, &conn) {
        true => ok(),
        false => internal_server_error().message("Looks like our code is buggy :("),
    }
}

#[derive(Deserialize)]
pub struct UnvoteData {
    pub project_id: Uuid,
}

#[post("/unvote", data = "<data>", format = "application/json")]
pub fn unvote(
    user: User,
    data: Json<UnvoteData>,
    conn: Conn,
) -> APIResponse {
    let vote_end = env::var("VOTE_END").expect("VOTE_END must be set in env");
    let end = DateTime::parse_from_rfc3339(&vote_end).expect("VOTE_END uses rfc3339 format.");

    if end < Utc::now() {
        return bad_request().message("Vote deadline is over.");
    }

    if !Vote::exists(&user.id, &data.project_id, &conn) {
        return bad_request().message("You have not voted for this project.");
    }

    match user.unvote(&data.project_id, &conn) {
        true => ok(),
        false => internal_server_error().message("Looks like our code is buggy :("),
    }
}

#[derive(Deserialize)]
pub struct CheckZidData {
    pub zid: String,
}

#[post("/check_zid", data = "<data>", format = "application/json")]
pub fn check_zid(
    data: Json<CheckZidData>,
    conn: Conn,
) -> APIResponse {
    let user = match User::get_by_zid(&data.zid, &conn) {
        Some(user) => user,
        None => return bad_request().message("zID is invalid. They must have an account."),
    };

    if user.project_id != None {
        return bad_request().message("They have already submitted a different project.");
    }

    ok().data(json!({
        "zid": user.zid,
        "name": user.name,
    }))
}

#[derive(Deserialize)]
pub struct SubmitProjectData {
    pub title: String,
    pub summary: String,
    pub link: String,
    pub repo: String,
    pub firstyear: bool,
    pub postgrad: bool,
    pub zids: Vec<String>,
}

#[post("/submit_project", data = "<project_data>", format = "application/json")]
pub fn submit_project(
    user: User,
    project_data: Json<SubmitProjectData>,
    conn: Conn,
) -> APIResponse {
    let project_end = env::var("PROJECT_END").expect("PROJECT_END must be set in env");
    let end = DateTime::parse_from_rfc3339(&project_end).expect("PROJECT_END uses rfc3339 format.");

    if end < Utc::now() {
        return bad_request().message("Project deadline is over.");
    }

    if project_data.zids.len() > 3 {
        return bad_request().message("You cannot have more than 3 team members (including yourself).");
    }

    let mut deduped_zids = project_data.zids.clone();
    deduped_zids.sort();
    deduped_zids.dedup();
    if deduped_zids.len() != project_data.zids.len() {
        return bad_request().message("You cannot count a team member twice.");
    }

    if !project_data.zids.contains(&user.zid) {
        return bad_request().message("Your zID is not included in the team.");
    }

    if !project_data.zids
        .iter()
        .all(|user_id| User::zid_can_do_project(user_id, &conn)) {
            return bad_request().message("Team contains invalid zIDs.");
        }

    let project = match Project::insert(
        &project_data.title,
        &project_data.summary,
        &project_data.link,
        &project_data.repo,
        project_data.firstyear,
        project_data.postgrad,
        &conn,
    ) {
        Some(project) => project,
        None => return internal_server_error().message("Looks like our code is buggy :("),
    };

    if !project_data.zids
        .iter()
        .all(|user_id| User::zid_do_project(user_id, &project.id, &conn)) {
            return bad_request().message("Team contains invalid zIDs.");
        }

    ok().data(json!({
        "project": {
            "id": project.id,
            "title": project.title,
            "summary": project.summary,
            "link": project.link,
            "repo": project.repo,
            "votes": project.count_votes(&conn),
            "zids": project.get_zids(&conn),
            "names": project.get_names(&conn),
        },
    }))
}

#[derive(Deserialize)]
pub struct EditProjectData {
    pub title: String,
    pub summary: String,
    pub link: String,
    pub repo: String,
    pub firstyear: bool,
    pub postgrad: bool,
    pub zids: Vec<String>,
}

#[post("/edit_project", data = "<project_data>", format = "application/json")]
pub fn edit_project(
    user: User,
    project_data: Json<EditProjectData>,
    conn: Conn,
) -> APIResponse {
    let project_end = env::var("PROJECT_END").expect("PROJECT_END must be set in env");
    let end = DateTime::parse_from_rfc3339(&project_end).expect("PROJECT_END uses rfc3339 format.");

    if end < Utc::now() {
        return bad_request().message("Project deadline is over.");
    }

    if project_data.zids.len() > 3 {
        return bad_request().message("You cannot have more than 3 team members (including yourself).");
    }

    let mut deduped_zids = project_data.zids.clone();
    deduped_zids.sort();
    deduped_zids.dedup();
    if deduped_zids.len() != project_data.zids.len() {
        return bad_request().message("You cannot count a team member twice.");
    }

    if !project_data.zids.contains(&user.zid) {
        return bad_request().message("Your zID is not included in the team.");
    }

    

    let project_id = match user.project_id {
        Some(project_id) => project_id,
        None => return bad_request().message("You have not submitted a project."),
    };

    if !project_data.zids
        .iter()
        .all(|zid| User::zid_doing_project(zid, &project_id, &conn) || User::zid_can_do_project(zid, &conn)) {
            return bad_request().message("Team contains invalid zIDs.");
        }

    if !Project::get_zids_from_id(&project_id, &conn)
        .iter()
        .all(|zid| User::zid_not_do_project(zid, &conn)) {
            return bad_request().message("Team contains invalid zIDs.");
        }

    let project = match Project::edit(
        &project_id,
        &project_data.title,
        &project_data.summary,
        &project_data.link,
        &project_data.repo,
        project_data.firstyear,
        project_data.postgrad,
        &conn,
    ) {
        Some(project) => project,
        None => return internal_server_error().message("Looks like our code is buggy :("),
    };

    if !project_data.zids
        .iter()
        .all(|user_id| User::zid_do_project(user_id, &project.id, &conn)) {
            return bad_request().message("Team contains invalid zIDs.");
        }

    ok().data(json!({
        "project": {
            "id": project.id,
            "title": project.title,
            "summary": project.summary,
            "link": project.link,
            "repo": project.repo,
            "votes": project.count_votes(&conn),
            "zids": project.get_zids(&conn),
            "names": project.get_names(&conn),
        },
    }))
}

#[get("/delete_project", format = "application/json")]
pub fn delete_project(
    user: User,
    conn: Conn,
) -> APIResponse {
    let project_end = env::var("PROJECT_END").expect("PROJECT_END must be set in env");
    let end = DateTime::parse_from_rfc3339(&project_end).expect("PROJECT_END uses rfc3339 format.");

    if end < Utc::now() {
        return bad_request().message("Project deadline is over.");
    }

    let project_id = match user.project_id {
        Some(project_id) => project_id,
        None => return bad_request().message("You have not submitted a project."),
    };

    if !Project::get_zids_from_id(&project_id, &conn)
        .iter()
        .all(|zid| User::zid_not_do_project(zid, &conn)) {
            return bad_request().message("Team contains invalid zIDs.");
        }

    match Project::delete(&project_id, &conn) {
        true => ok(),
        false => internal_server_error().message("Looks like our code is buggy :("),
    }
}

#[get("/deadlines")]
pub fn deadlines(
) -> APIResponse {
    let project_end = env::var("PROJECT_END").expect("PROJECT_END must be set in env");
    let vote_end = env::var("VOTE_END").expect("VOTE_END must be set in env");

    ok().data(json!({
        "projectDeadline": project_end,
        "voteDeadline": vote_end,
    }))
}
