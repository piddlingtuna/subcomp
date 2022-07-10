use rocket::http::Method;
use rocket_cors::{AllowedOrigins, Cors, CorsOptions};

pub fn cors() -> Cors {
    CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            vec![Method::Get, Method::Post]
                .into_iter()
                .map(From::from)
                .collect(),
        )
        .to_cors()
        .expect("Failed to create CORS")
}
