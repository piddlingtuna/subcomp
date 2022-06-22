use rocket::response::NamedFile;
use std::path::{Path, PathBuf};

#[get("/")]
pub fn index() -> Option<NamedFile> {
    NamedFile::open("public/index.html").ok()
}

#[get("/<file..>", rank = 2)]
pub fn files(file: PathBuf) -> Option<NamedFile> {
    let path = Path::new("public/").join(file);
    if path.exists() {
        return NamedFile::open(path).ok();
    }
    NamedFile::open("public/index.html").ok()
}
