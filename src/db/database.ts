import Database from "better-sqlite3";

const db = new Database("waitlist.db");

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_number INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    party_size INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ticket_counter (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    next_ticket_number INTEGER NOT NULL
  );
`);

const maxTicket = db
  .prepare(`
    SELECT COALESCE(MAX(ticket_number), 0) AS max_ticket
    FROM waitlist
  `)
  .get() as { max_ticket: number };

db.prepare(`
  INSERT OR IGNORE INTO ticket_counter (id, next_ticket_number)
  VALUES (1, ?)
`).run(maxTicket.max_ticket + 1);

db.prepare(`
  UPDATE ticket_counter
  SET next_ticket_number = ?
  WHERE id = 1
    AND next_ticket_number <= ?
`).run(maxTicket.max_ticket + 1, maxTicket.max_ticket);

export default db;