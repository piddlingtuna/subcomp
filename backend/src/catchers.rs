use rocket::catch;

use crate::responses::{bad_request, forbidden, internal_server_error, not_found, service_unavailable, unauthorized, APIResponse};

#[catch(400)]
pub fn bad_request_catcher() -> APIResponse {
    bad_request()
}

#[catch(401)]
pub fn unauthorized_catcher() -> APIResponse {
    unauthorized()
}

#[catch(403)]
pub fn forbidden_catcher() -> APIResponse {
    forbidden()
}

#[catch(404)]
pub fn not_found_catcher() -> APIResponse {
    not_found()
}

#[catch(500)]
pub fn internal_server_error_catcher() -> APIResponse {
    internal_server_error()
}

#[catch(503)]
pub fn service_unavailable_catcher() -> APIResponse {
    service_unavailable()
}
