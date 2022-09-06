#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate rocket;

use dotenv::dotenv;
use rocket::{catchers, routes};
use std::env;

pub mod api;
pub mod catchers;
pub mod cors;
pub mod database;
pub mod models;
pub mod responses;
pub mod schema;

/// Constructs a new Rocket instance.
///
/// This function takes care of attaching all routes and catchers of the application.
pub fn rocket_factory(database_url: &str) -> rocket::Rocket {
    rocket::ignite()
        .manage(database::init_pool(database_url))
        .mount(
            "/api",
            routes![
                api::projects,
                api::all_projects,
                api::user,
                api::generate_verification,
                api::use_verification,
                api::login,
                api::logout,
                api::change_name,
                api::change_password,
                api::generate_reset,
                api::use_reset,
                api::vote,
                api::unvote,
                api::has_voted,
                api::check_zid,
                api::submit_project,
                api::edit_project,
                api::delete_project,
                api::deadlines,
            ],
        )
        .register(catchers![
            catchers::bad_request_catcher,
            catchers::unauthorized_catcher,
            catchers::forbidden_catcher,
            catchers::not_found_catcher,
            catchers::internal_server_error_catcher,
            catchers::service_unavailable_catcher,
        ])
        .attach(cors::cors())
}

fn main() {
    dotenv().ok();

    // Must contain the following in .env
    // DATABASE_URL
    // PASSWORD_SALT
    // DOMAIN
    // SMTP_USERNAME
    // SMTP_PASSWORD
    // PROJECT_END
    // VOTE_END

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set in env");
    rocket_factory(&database_url).launch();
}
