import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '..', '7ssabi.db')
db_path = os.path.abspath(db_path)
print(f"Connecting to: {db_path}")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Add exchange_rate column
try:
    cursor.execute("ALTER TABLE invoices ADD COLUMN exchange_rate NUMERIC(12, 4) NOT NULL DEFAULT 1;")
    print("✅ Added 'exchange_rate' column.")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("⚠️ 'exchange_rate' column already exists.")
    else:
        raise

# Add total_dzd column
try:
    cursor.execute("ALTER TABLE invoices ADD COLUMN total_dzd NUMERIC(18, 2) NOT NULL DEFAULT 0;")
    print("✅ Added 'total_dzd' column.")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("⚠️ 'total_dzd' column already exists.")
    else:
        raise

conn.commit()
conn.close()
print("Migration complete.")