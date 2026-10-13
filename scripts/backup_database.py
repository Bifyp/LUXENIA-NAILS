"""Consistent SQLite online backup; never overwrites a backup or edits the source."""
import argparse
import os
from pathlib import Path
import sqlite3
from urllib.parse import quote


def backup_database(source: Path, destination: Path) -> None:
    source = source.resolve()
    destination = destination.resolve()
    if not source.is_file():
        raise ValueError('Source database does not exist')
    if source == destination:
        raise ValueError('Source and destination must differ')
    # Exclusive creation and restrictive permissions, including before any pages are written.
    fd = os.open(destination, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    os.close(fd)
    try:
        with sqlite3.connect(f'file:{quote(str(source))}?mode=ro', uri=True) as src:
            with sqlite3.connect(destination) as dst:
                src.backup(dst)
                if dst.execute('PRAGMA integrity_check').fetchall() != [('ok',)]:
                    raise ValueError('Backup integrity check failed')
                if dst.execute('PRAGMA foreign_key_check').fetchall():
                    raise ValueError('Backup foreign-key check failed')
    except BaseException:
        destination.unlink(missing_ok=True)
        raise


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('destination', type=Path)
    args = parser.parse_args()
    backup_database(args.source, args.destination)
    print('Backup created and integrity-checked. Restrict access and test recovery separately.')
