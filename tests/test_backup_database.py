import importlib.util
from pathlib import Path
import sqlite3
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('backup', Path(__file__).resolve().parents[1] / 'scripts/backup_database.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class BackupTests(unittest.TestCase):
    def test_backup_and_restore_wal_database_without_overwriting(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'app.db'
            target = Path(directory) / 'backup.db'
            with sqlite3.connect(source) as live:
                live.execute('PRAGMA journal_mode=WAL')
                live.execute('CREATE TABLE Booking (id TEXT PRIMARY KEY, status TEXT)')
                live.execute("INSERT INTO Booking VALUES ('synthetic', 'pending')")
                live.commit()
                module.backup_database(source, target)
                with sqlite3.connect(target) as restored:
                    self.assertEqual(restored.execute('SELECT status FROM Booking').fetchone(), ('pending',))
                self.assertEqual(target.stat().st_mode & 0o777, 0o600)
                with self.assertRaises(FileExistsError):
                    module.backup_database(source, target)
                self.assertEqual(live.execute('SELECT COUNT(*) FROM Booking').fetchone()[0], 1)

    def test_missing_source_creates_no_destination(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / 'backup.db'
            with self.assertRaises(ValueError):
                module.backup_database(Path(directory) / 'absent.db', target)
            self.assertFalse(target.exists())


if __name__ == '__main__':
    unittest.main()
