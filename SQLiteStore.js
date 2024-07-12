const session = require('express-session');
const MemoryStore = session.MemoryStore;

class SQLiteStore extends MemoryStore {
    constructor(options) {
        super(options);  
        this.client = options.client;
    }

    get(sid, callback) {
        try { 
          const now = Date.now(); 
          const row = this.client.prepare(`
            SELECT *
            FROM sessions 
            WHERE sid = ? AND expires > ?
          `).get(sid, now); 
  
          if (row) {
              // Parse JSON after retrieving
              const sessionData = row.data ? JSON.parse(row.data) : null;
              callback(null, sessionData); 
          } else {
              callback(null, null); 
          }
        } catch (err) {
          callback(err); 
        }
    }
  
  
    set(sid, sessionData, callback) {
        try {
          const expires = (sessionData.cookie.maxAge 
                            ? Date.now() + sessionData.cookie.maxAge 
                            : Date.now() + (24 * 60 * 60 * 1000)) / 1000 ; 
  
          this.client.prepare(`
            INSERT OR REPLACE INTO sessions (sid, expires, data)
            VALUES (?, ?, ?)
          `).run(sid, expires, JSON.stringify(sessionData)); // Stringify session object here!
  
          callback();
        } catch (err) {
          callback(err); 
        }
    }

    destroy(sid, callback) {
        const stmt = this.client.prepare('DELETE FROM sessions WHERE sid = ?');
        stmt.run(sid, (err) => {
            if (err) {
                callback(err);
            } else {
                callback();
            }
        });
    }
}

module.exports = SQLiteStore;
