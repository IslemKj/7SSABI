import psycopg2
from psycopg2 import sql
import os

# Get DB URL from environment or hardcode for now
DB_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:islam2003@localhost:5432/7ssabi_db')

conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

# Add exchange_rate column
try:
    cur.execute("ALTER TABLE invoices ADD COLUMN exchange_rate NUMERIC(12, 4) NOT NULL DEFAULT 1;")
    print("✅ Added 'exchange_rate' column.")
except psycopg2.errors.DuplicateColumn:
    print("⚠️ 'exchange_rate' column already exists.")
except Exception as e:
    if 'already exists' in str(e):
        print("⚠️ 'exchange_rate' column already exists.")
    else:
        raise

# Add total_dzd column
try:
    cur.execute("ALTER TABLE invoices ADD COLUMN total_dzd NUMERIC(18, 2) NOT NULL DEFAULT 0;")
    print("✅ Added 'total_dzd' column.")
except psycopg2.errors.DuplicateColumn:
    print("⚠️ 'total_dzd' column already exists.")
except Exception as e:
    if 'already exists' in str(e):
        print("⚠️ 'total_dzd' column already exists.")
    else:
        raise

conn.commit()
cur.close()
conn.close()
print("Migration complete.")
