#!/bin/bash
# Backup PostgreSQL Database - Involeo
# Usage: ./backup_db.sh

# Configuration
DB_NAME="${DB_NAME:-involeo_db}"
DB_USER="${DB_USER:-postgres}"
BACKUP_DIR="/var/backups/involeo"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="involeo_backup_$DATE.sql.gz"
MAX_BACKUPS=30  # Keep 30 days of backups

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Involeo Database Backup...${NC}"

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${YELLOW}Creating backup directory: $BACKUP_DIR${NC}"
    mkdir -p $BACKUP_DIR
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to create backup directory${NC}"
        exit 1
    fi
fi

# Perform backup with compression
echo -e "${YELLOW}Backing up database: $DB_NAME${NC}"
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/$FILENAME

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup successful: $FILENAME${NC}"
    
    # Get file size
    SIZE=$(du -h "$BACKUP_DIR/$FILENAME" | cut -f1)
    echo -e "${GREEN}  Size: $SIZE${NC}"
    
    # Delete old backups (older than MAX_BACKUPS days)
    echo -e "${YELLOW}Cleaning up old backups (older than $MAX_BACKUPS days)...${NC}"
    find $BACKUP_DIR -name "involeo_backup_*.sql.gz" -mtime +$MAX_BACKUPS -delete
    
    # Count remaining backups
    BACKUP_COUNT=$(find $BACKUP_DIR -name "involeo_backup_*.sql.gz" | wc -l)
    echo -e "${GREEN}✓ Total backups: $BACKUP_COUNT${NC}"
    
else
    echo -e "${RED}✗ Backup failed${NC}"
    exit 1
fi

echo -e "${GREEN}Backup completed successfully!${NC}"
