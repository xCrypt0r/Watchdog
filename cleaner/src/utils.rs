use std::fs;
use std::io::{self, Read, Write};
use std::path::{Path, PathBuf};
use std::time::{SystemTime};

use xxhash_rust::xxh3::xxh3_64;

pub fn get_subdirectories(path: &Path) -> Vec<PathBuf> {
    fs::read_dir(path)
        .expect("디렉토리 읽기 실패")
        .filter_map(|entry| {
            entry.ok().and_then(|e| {
                let path = e.path();
                if path.is_dir() {
                    Some(path)
                } else {
                    None
                }
            })
        })
        .collect()
}

pub fn get_folder_choice(subdirs: &Vec<PathBuf>) -> usize {
    let mut input = String::new();

    loop {
        print!("정리할 폴더 번호 입력: ");
        io::stdout().flush().unwrap();
        input.clear();
        io::stdin().read_line(&mut input).expect("입력 실패");

        match input.trim().parse::<usize>() {
            Ok(num) if num <= subdirs.len() => return num,
            _ => eprintln!("❌ 잘못된 입력입니다. 다시 선택해주세요."),
        }
    }
}

pub fn get_file_modified_time(path: &PathBuf) -> Option<SystemTime> {
    fs::metadata(path).map_err(|e| {
        eprintln!("⚠️ 메타데이터 읽기 실패: {} ({})", path.display(), e);
    }).ok()?.modified().map_err(|e| {
        eprintln!("⚠️ 수정 시간 읽기 실패: {} ({})", path.display(), e);
    }).ok()
}

pub fn compute_xxhash(path: &PathBuf) -> Option<u64> {
    let mut file = fs::File::open(path).map_err(|e| {
        eprintln!("⚠️ 파일 열기 실패: {} ({})", path.display(), e);
    }).ok()?;
    let mut buffer = Vec::new();

    file.read_to_end(&mut buffer).map_err(|e| {
        eprintln!("⚠️ 파일 읽기 실패: {} ({})", path.display(), e);
    }).ok()?;
    Some(xxh3_64(&buffer))
}

pub fn format_bytes(bytes: u64) -> String {
    const KB: f64 = 1024.0;
    const MB: f64 = KB * 1024.0;
    const GB: f64 = MB * 1024.0;
    const TB: f64 = GB * 1024.0;

    let b = bytes as f64;

    if b >= TB {
        format!("{:.2} TB", b / TB)
    } else if b >= GB {
        format!("{:.2} GB", b / GB)
    } else if b >= MB {
        format!("{:.2} MB", b / MB)
    } else if b >= KB {
        format!("{:.2} KB", b / KB)
    } else {
        format!("{} B", bytes)
    }
}
