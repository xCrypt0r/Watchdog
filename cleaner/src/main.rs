mod cleaner;
mod utils;

use cleaner::process_directory;
use utils::{format_bytes, get_folder_choice, get_subdirectories};

use std::io::{self, Write};
use std::time::Instant;

fn main() -> io::Result<()> {
    let stdout = io::stdout();
    let mut handle = stdout.lock();
    let current_dir = std::env::current_dir().expect("현재 디렉토리 확인 실패");
    let mut subdirs = get_subdirectories(&current_dir);

    if subdirs.is_empty() {
        writeln!(handle, "❌ 하위 폴더가 없습니다.")?;

        return Ok(());
    }

    subdirs.sort_by_key(|path| path.file_name().map(|name| name.to_os_string()));

    writeln!(handle, "📂 폴더 목록:")?;
    writeln!(handle, "  [0] 전체 하위 폴더")?;

    for (i, dir) in subdirs.iter().enumerate() {
        writeln!(handle, "  [{}] {}", i + 1, dir.file_name().unwrap().to_string_lossy())?;
    }

    let choice = get_folder_choice(&subdirs);
    let start_all = Instant::now();
    let mut total_deleted_files = 0;
    let mut total_all_files = 0;
    let mut total_deleted_bytes = 0;
    let targets = if choice == 0 {
        subdirs.iter().collect::<Vec<_>>()
    } else {
        vec![&subdirs[choice - 1]]
    };

    for dir in targets {
        let (deleted, all_files, deleted_bytes) = process_directory(dir, &mut handle)?;

        total_deleted_files += deleted;
        total_all_files += all_files;
        total_deleted_bytes += deleted_bytes;
    }

    let duration_all = start_all.elapsed();

    writeln!(
        handle,
        "\n⏰ {:.2?}\n📄 총 파일 수: {}개\n🗑️  삭제한 파일: {}개\n💾 삭제한 파일 용량: {}",
        duration_all,
        total_all_files,
        total_deleted_files,
        format_bytes(total_deleted_bytes)
    )?;
    handle.flush()?;

    let _ = io::stdin().read_line(&mut String::new());

    Ok(())
}
