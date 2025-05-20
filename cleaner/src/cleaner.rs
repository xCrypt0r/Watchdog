use crate::utils::{compute_xxhash, format_bytes, get_file_modified_time};

use std::collections::HashMap;
use std::fs;
use std::io::{self, Write};
use std::path::{Path, PathBuf};
use std::sync::Mutex;

use colored::*;
use rayon::prelude::*;
use walkdir::WalkDir;

pub fn process_directory(dir: &PathBuf, writer: &mut impl Write) -> io::Result<(usize, usize, u64)> {
    writeln!(writer, "\n📁 {}\n", dir.file_name().unwrap().to_string_lossy())?;

    let start = std::time::Instant::now();
    let (deleted, all_files, deleted_bytes) = clean_duplicates(dir, writer)?;
    let duration = start.elapsed();

    writeln!(
        writer,
        "📁 {} ⏰ {:.2?} 🗑️  {}개 중 {}개 삭제 ({})\n",
        dir.file_name().unwrap().to_string_lossy(),
        duration,
        all_files,
        deleted,
        format_bytes(deleted_bytes)
    )?;
    writeln!(writer, "════════════════════════════════════════")?;

    Ok((deleted, all_files, deleted_bytes))
}

fn clean_duplicates(target_dir: &Path, writer: &mut impl Write) -> io::Result<(usize, usize, u64)> {
    let size_map = collect_files_by_size(target_dir);
    let mut deleted_files = 0;
    let mut deleted_bytes = 0;
    let total_files = size_map.values().map(|v| v.len()).sum();

    for (_size, files) in size_map {
        if files.len() < 2 {
            continue;
        }

        let hash_map = group_files_by_hash(&files);

        for (_hash, dup_files) in hash_map {
            if dup_files.len() < 2 {
                continue;
            }

            let (d_files, d_bytes) = delete_duplicates(dup_files, writer)?;

            deleted_files += d_files;
            deleted_bytes += d_bytes;
        }
    }

    Ok((deleted_files, total_files, deleted_bytes))
}

fn collect_files_by_size(target_dir: &Path) -> HashMap<u64, Vec<PathBuf>> {
    let mut size_map: HashMap<u64, Vec<PathBuf>> = HashMap::new();

    for entry in WalkDir::new(target_dir).into_iter().filter_map(Result::ok) {
        if entry.metadata().map(|m| m.is_file()).unwrap_or(false) {
            let path = entry.path().to_path_buf();
            let size = entry.metadata().map(|m| m.len()).unwrap_or(0);

            size_map.entry(size).or_default().push(path);
        }
    }

    size_map
}

fn group_files_by_hash(files: &[PathBuf]) -> HashMap<u64, Vec<PathBuf>> {
    let hash_map = Mutex::new(HashMap::<u64, Vec<PathBuf>>::new());

    files.par_iter().for_each(|path| {
        if let Some(hash) = compute_xxhash(path) {
            let mut map = hash_map.lock().unwrap();

            map.entry(hash).or_default().push(path.clone());
        }
    });

    hash_map.into_inner().unwrap()
}

fn delete_duplicates(dup_files: Vec<PathBuf>, writer: &mut impl Write) -> io::Result<(usize, u64)> {
    let mut deleted_files = 0;
    let mut deleted_bytes = 0;
    let mut files_with_time: Vec<_> = dup_files
        .into_iter()
        .filter_map(|path| {
            get_file_modified_time(&path).map(|time| (path, time))
        })
        .collect();

    files_with_time.sort_by_key(|(_, time)| *time);

    if let Some((keep_path, _)) = files_with_time.first() {
        writeln!(
            writer,
            "{} {}",
            "보존:".green(),
            keep_path.file_name().unwrap().to_string_lossy().green()
        )?;

        for (path, _) in &files_with_time[1..] {
            writeln!(
                writer,
                "{} {}",
                "삭제:".red(),
                path.file_name().unwrap().to_string_lossy().red()
            )?;
            match fs::metadata(path) {
                Ok(meta) => {
                    let size = meta.len();

                    if fs::remove_file(path).is_ok() {
                        deleted_files += 1;
                        deleted_bytes += size;
                    } else {
                        writeln!(writer, "❌ 삭제 실패: {}", path.display())?;
                    }
                }
                Err(_) => {
                    writeln!(writer, "⚠️ 파일 메타데이터 확인 실패: {}", path.display())?;
                }
            }
        }

        writeln!(writer)?;
    }

    Ok((deleted_files, deleted_bytes))
}
