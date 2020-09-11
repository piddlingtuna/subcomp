#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate rocket;

use dotenv::dotenv;
use std::env;
use rocket::{catchers, routes};
use rocket_cors::CorsOptions;

pub mod models;
pub mod api;
pub mod database;
pub mod files;
pub mod handlers;
pub mod responses;
pub mod schema;

/// Constructs a new Rocket instance.
///
/// This function takes care of attaching all routes and handlers of the application.
pub fn rocket_factory(database_url: &str) -> rocket::Rocket {
    let options = CorsOptions::default().to_cors().unwrap();

    rocket::ignite()
        .attach(options)
        .manage(database::init_pool(database_url))
        .mount("/", routes![files::index])
        .mount("/api", routes![
            api::projects,
            api::user,
            api::generate_verification,
            api::use_verification,
            api::login,
            api::logout,
            api::change_full_name,
            api::change_password,
            api::generate_reset,
            api::use_reset,
            api::vote,
            api::unvote,
            api::check_zid,
            api::submit_project,
            api::edit_project,
            api::delete_project,
            api::deadlines,
        ])
        .register(catchers![
            handlers::bad_request_handler,
            handlers::unauthorized_handler,
            handlers::forbidden_handler,
            handlers::not_found_handler,
            handlers::internal_server_error_handler,
            handlers::service_unavailable_handler,
        ])
}

fn main() {
    dotenv().ok();

    // Must contain the following in .env
    // DATABASE_URL
    // LOGIN_SALT
    // DOMAIN
    // SMTP_USERNAME
    // SMTP_PASSWORD
    // PROJECT_END
    // VOTE_END

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set in .env");
    rocket_factory(&database_url)
        .launch();
}
