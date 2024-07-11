const Database = require('better-sqlite3');
const db = new Database('chatbot.db');

module.exports = db;
