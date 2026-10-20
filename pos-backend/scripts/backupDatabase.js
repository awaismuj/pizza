/**
 * Automated MongoDB Backup & Rotation Script
 * Dumps all database collections to timestamped JSON archives,
 * writes metadata, and purges backups older than 30 days.
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const config = require("../config/config");

const BACKUP_DIR = path.join(__dirname, "../backups");
const RETENTION_DAYS = 30;

async function performBackup() {
    console.log("Starting automated database backup...");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFolder = path.join(BACKUP_DIR, `backup-${timestamp}`);

    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    try {
        await mongoose.connect(config.databaseURI);
        console.log(`Connected to database: ${mongoose.connection.name}`);

        fs.mkdirSync(backupFolder, { recursive: true });

        const collections = await mongoose.connection.db.listCollections().toArray();
        let totalDocs = 0;

        for (const col of collections) {
            const colName = col.name;
            const docs = await mongoose.connection.db.collection(colName).find({}).toArray();
            const filePath = path.join(backupFolder, `${colName}.json`);
            fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), "utf8");
            console.log(`  - Backed up collection [${colName}]: ${docs.length} documents`);
            totalDocs += docs.length;
        }

        const metadata = {
            timestamp: new Date().toISOString(),
            database: mongoose.connection.name,
            totalCollections: collections.length,
            totalDocuments: totalDocs,
            version: "1.0.0",
        };
        fs.writeFileSync(path.join(backupFolder, "metadata.json"), JSON.stringify(metadata, null, 2));

        console.log(`Backup completed successfully at: ${backupFolder}`);
        console.log(`Total documents backed up: ${totalDocs}`);

        // Purge backups older than RETENTION_DAYS
        cleanOldBackups();
    } catch (err) {
        console.error("Backup failed with error:", err);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

function cleanOldBackups() {
    try {
        const entries = fs.readdirSync(BACKUP_DIR);
        const cutoffTime = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;

        for (const entry of entries) {
            const entryPath = path.join(BACKUP_DIR, entry);
            const stats = fs.statSync(entryPath);
            if (stats.isDirectory() && entry.startsWith("backup-") && stats.mtimeMs < cutoffTime) {
                fs.rmSync(entryPath, { recursive: true, force: true });
                console.log(`Purged obsolete backup older than ${RETENTION_DAYS} days: ${entry}`);
            }
        }
    } catch (err) {
        console.warn("Could not clean old backups:", err.message);
    }
}

if (require.main === module) {
    performBackup();
}

module.exports = { performBackup };
