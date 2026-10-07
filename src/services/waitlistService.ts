import db from "../db/database.ts";

const addToWaitlistTransaction = db.transaction(
  (name: string, partySize: number) => {
    const counter = db
      .prepare(`
        SELECT next_ticket_number
        FROM ticket_counter
        WHERE id = 1
      `)
      .get() as { next_ticket_number: number };

    const ticketNumber = counter.next_ticket_number;

    db.prepare(`
      UPDATE ticket_counter
      SET next_ticket_number = next_ticket_number + 1
      WHERE id = 1
    `).run();

    db.prepare(`
      INSERT INTO waitlist (ticket_number, name, party_size)
      VALUES (?, ?, ?)
    `).run(ticketNumber, name, partySize);

    return {
      ticketNumber
    };
  }
);

export function addToWaitlist(name: string, partySize: number) {
  return addToWaitlistTransaction(name, partySize);
}

export function getWaitlist() {
  return db
    .prepare(`
      SELECT ticket_number, name, party_size, created_at
      FROM waitlist
      ORDER BY id ASC
    `)
    .all();
}

export function getPartiesAhead(ticketNumber: number) {
  const ticket = db
    .prepare(`
      SELECT id
      FROM waitlist
      WHERE ticket_number = ?
    `)
    .get(ticketNumber) as { id: number } | undefined;

  if (!ticket) {
    return null;
  }

  const result = db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM waitlist
      WHERE id < ?
    `)
    .get(ticket.id) as { count: number };

  return result.count;
}

export function removeFromWaitlist(ticketNumber: number) {
  const result = db
    .prepare(`
      DELETE FROM waitlist
      WHERE ticket_number = ?
    `)
    .run(ticketNumber);

  return result.changes > 0;
}