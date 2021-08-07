use rocket::catch;
use rocket::response::NamedFile;

use crate::responses::{bad_request, forbidden, internal_server_error, service_unavailable, unauthorized, APIResponse};

#[catch(400)]
pub fn bad_request_handler() -> APIResponse {
    bad_request()
}

#[catch(401)]
pub fn unauthorized_handler() -> APIResponse {
    unauthorized()
}

#[catch(403)]
pub fn forbidden_handler() -> APIResponse {
    forbidden()
}

#[catch(404)]
pub fn not_found_handler() -> Option<NamedFile> {
    NamedFile::open("public/index.html").ok()
}

#[catch(500)]
pub fn internal_server_error_handler() -> APIResponse {
    internal_server_error()
}

#[catch(503)]
pub fn service_unavailable_handler() -> APIResponse {
    service_unavailable()
}
