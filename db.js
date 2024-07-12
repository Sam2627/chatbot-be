const path = require('path');
const Database = require('better-sqlite3');

// Set the database path relative to the current directory
const dbPath = path.resolve(__dirname, 'chatbot.db');
const db = new Database(dbPath);

module.exports = db;
