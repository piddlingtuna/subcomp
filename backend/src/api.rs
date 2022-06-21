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
                "zIDs": project.get_zIDs(&conn),
                "fullNames": project.get_full_names(&conn),
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
            "zID": user.zID,
            "fullName": user.full_name,
            "votes": user.get_votes(&conn),
            "projectId": user.get_project(&conn),
        },
    }))
}

#[derive(Deserialize)]
pub struct GenerateVerificationData {
    pub zID: String,
    pub full_name: String,
    pub password: String,
}

#[post("/generate_verification", data ="<data>", format = "application/json")]
pub fn generate_verification(
    data: Json<GenerateVerificationData>,
    conn: Conn,
) -> APIResponse {
    let re = Regex::new(r"^z[0-9]{7}$").unwrap();
    if !re.is_match(&data.zID) {
        return bad_request().message("zID is invalid.");
    }

    if data.password.len() < 8 {
        return bad_request().message("Password must be at least 8 characters.");
    }

    if User::exists_by_zID(&data.zID, &conn) {
        return bad_request().message("There is already an account with this zID.");
    }

    let verification = match Verification::insert(&data.zID, &data.full_name, &data.password, &conn) {
        Some(verification) => verification,
        None => return internal_server_error(),
    };

    let unsw_email = format!("<{}@unsw.edu.au>", &data.zID);
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

    let user = match User::insert(&verification.zID, &verification.full_name, &verification.password_hash, &conn) {
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
            "zID": user.zID,
            "fullName": user.full_name,
            "votes": user.get_votes(&conn),
            "projectId": user.get_project(&conn),
        },
    }))
}

#[derive(Deserialize)]
pub struct LoginData {
    zID: String,
    password: String,
}

#[post("/login", data = "<data>", format = "application/json")]
pub fn login(
    data: Json<LoginData>,
    conn: Conn,
) -> APIResponse {
    let user = match User::get_by_zID(&data.zID, &conn) {
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
            "zID": user.zID,
            "fullName": user.full_name,
            "votes": user.get_votes(&conn),
            "projectId": user.get_project(&conn),
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
    pub full_name: String,
}

#[post("/change_full_name", data = "<data>", format = "application/json")]
pub fn change_full_name(
    user: User,
    data: Json<ChangeFullNameData>,
    conn: Conn,
) -> APIResponse {
    match user.change_full_name(&data.full_name, &conn) {
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
    pub zID: String,
}

#[post("/generate_reset", data = "<data>", format = "application/json")]
pub fn generate_reset(
    data: Json<GenerateResetData>,
    conn: Conn,
) -> APIResponse {
    let reset = match Reset::insert(&data.zID, &conn) {
        Some(reset) => reset,
        None => return bad_request().message("zID is invalid."),
    };

    let unsw_email = format!("<{}@unsw.edu.au>", &data.zID);
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
            "zID": user.zID,
            "fullName": user.full_name,
            "votes": user.get_votes(&conn),
            "projectId": user.get_project(&conn),
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
    pub zID: String,
}

#[post("/check_zID", data = "<data>", format = "application/json")]
pub fn check_zID(
    data: Json<CheckZidData>,
    conn: Conn,
) -> APIResponse {
    let user = match User::get_by_zID(&data.zID, &conn) {
        Some(user) => user,
        None => return bad_request().message("zID is invalid. They must have an account."),
    };

    if user.project_id != None {
        return bad_request().message("They have already submitted a different project.");
    }

    ok().data(json!({
        "zID": user.zID,
        "fullName": user.full_name,
    }))
}

#[derive(Deserialize)]
pub struct SubmitProjectData {
    pub title: String,
    pub summary: String,
    pub link: String,
    pub repo: String,
    pub first_year: bool,
    pub postgraduate: bool,
    pub zIDs: Vec<String>,
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

    if project_data.zIDs.len() > 3 {
        return bad_request().message("You cannot have more than 3 team members (including yourself).");
    }

    if !project_data.zIDs.contains(&user.zID) {
        return bad_request().message("Your zID is not included in the team.");
    }

    if !project_data.zIDs
        .iter()
        .all(|user_id| User::zID_can_do_project(&user_id, &conn)) {
            return bad_request().message("Team contains invalid zIDs.");
        }

    let project = match Project::insert(
        &project_data.title,
        &project_data.summary,
        &project_data.link,
        &project_data.repo,
        project_data.first_year,
        project_data.postgraduate,
        &conn,
    ) {
        Some(project) => project,
        None => return internal_server_error().message("Looks like our code is buggy :("),
    };

    if !project_data.zIDs
        .iter()
        .all(|user_id| User::zID_do_project(&user_id, &project.id, &conn)) {
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
            "zIDs": project.get_zIDs(&conn),
            "fullNames": project.get_full_names(&conn),
        },
    }))
}

#[derive(Deserialize)]
pub struct EditProjectData {
    pub title: String,
    pub summary: String,
    pub link: String,
    pub repo: String,
    pub first_year: bool,
    pub postgraduate: bool,
    pub zIDs: Vec<String>,
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

    if project_data.zIDs.len() > 3 {
        return bad_request().message("You cannot have more than 3 team members (including yourself).");
    }

    if !project_data.zIDs.contains(&user.zID) {
        return bad_request().message("Your zID is not included in the team.");
    }

    let project_id = match user.project_id {
        Some(project_id) => project_id,
        None => return bad_request().message("You have not submitted a project."),
    };

    if !project_data.zIDs
        .iter()
        .all(|zID| User::zID_doing_project(&zID, &project_id, &conn) || User::zID_can_do_project(&zID, &conn)) {
            return bad_request().message("Team contains invalid zIDs.");
        }

    if !Project::get_zIDs_from_id(&project_id, &conn)
        .iter()
        .all(|zID| User::zID_not_do_project(&zID, &conn)) {
            return bad_request().message("Team contains invalid zIDs.");
        }

    let project = match Project::edit(
        &project_id,
        &project_data.title,
        &project_data.summary,
        &project_data.link,
        &project_data.repo,
        project_data.first_year,
        project_data.postgraduate,
        &conn,
    ) {
        Some(project) => project,
        None => return internal_server_error().message("Looks like our code is buggy :("),
    };

    if !project_data.zIDs
        .iter()
        .all(|user_id| User::zID_do_project(&user_id, &project.id, &conn)) {
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
            "zIDS": project.get_zIDs(&conn),
            "fullNames": project.get_full_names(&conn),
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

    if !Project::get_zIDs_from_id(&project_id, &conn)
        .iter()
        .all(|zID| User::zID_not_do_project(&zID, &conn)) {
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
