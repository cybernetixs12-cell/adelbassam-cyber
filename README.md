# Restaurant Waitlist System

A simple restaurant waitlist system where customers can join a waitlist, receive a unique ticket number, and check how many parties are ahead of them. Staff can view the waitlist in join order and remove parties from a protected staff screen.

## Tech Stack

- Node.js
- Express
- TypeScript
- SQLite
- better-sqlite3
- express-session
- HTML, CSS, and JavaScript

## How to Run

### 1. Install dependencies

Open PowerShell in the project folder and run:

```powershell
npm install
````

### 2. Start the application in development mode

```powershell
npm run dev
```

Then open:

```text
http://localhost:3000
```

### 3. Build the project

```powershell
npm run build
```

### 4. Start the compiled application

```powershell
npm start
```

Then open:

```text
http://localhost:3000
```

The SQLite database is created automatically as `waitlist.db` when the application starts.

## Main Screens

### Customer

```text
http://localhost:3000
```

Customers can:

* Join the waitlist using a name and party size.
* Receive a unique ticket number.
* Check the number of parties ahead.
* Automatically see their position update.
* Keep their ticket number after refreshing or reopening the page on the same device.

### Staff

```text
http://localhost:3000/staff.html
```

Staff can:

* Log in through the protected staff login.
* View all waiting parties in join order.
* See each party's ticket number, name, and party size.
* Remove any party from the waitlist.
* Refresh the waitlist manually.
* Automatically see changes to the waitlist.
* Log out when finished.

### Demo Staff Credentials

```text
Username: staff
PIN: 1234
```

These credentials are intended only for this local assessment application.

## Validation and Rules

* Customer name cannot be empty.
* Party size must be a positive whole number.
* Ticket numbers are unique.
* Ticket numbers are never reused after a party is removed, even when the waitlist becomes empty.
* Parties ahead are counted as parties, not individual people.
* Invalid ticket numbers return appropriate errors.
* Nonexistent tickets return appropriate errors.
* The staff waitlist API requires staff authentication.
* Customer endpoints remain available without a customer account.

## Navigation

The application includes a simple navigation bar across the customer, staff login, and staff pages.

## Why These Technologies?

I chose Node.js with Express and TypeScript because they provide a simple structure for building the API while keeping the code organized and type-safe. I chose SQLite with better-sqlite3 because the application needs persistent database storage but does not require a separate database server for this small local assessment.

## Completion Status

### Completed

* Customer joins waitlist.
* Unique ticket numbers.
* Ticket numbers are never reused.
* Persistent SQLite database.
* Customer position checking.
* Correct party-ahead calculation.
* Automatic position updates.
* Same-device ticket persistence.
* Separate staff screen.
* Staff authentication.
* Protected staff waitlist API.
* Staff waitlist view.
* Staff removal of parties.
* Staff logout.
* Input validation.
* Handling of invalid/nonexistent tickets.
* Responsive simple phone-friendly UI.
* Navigation bar.
* Build verification with `npm run build`.
* Local application testing.

### Not Completed

Customer self-removal was not implemented because it is an optional feature and was not necessary for the core requirements.

## Testing and Verification

The application was tested by adding multiple parties, checking their positions, removing parties ahead of other customers, and checking the positions again.

Ticket numbering was tested by removing tickets and then adding new parties. Ticket numbers continued increasing and were not reused. The empty-waitlist case was also tested to confirm that ticket numbering did not reset.

Invalid inputs were tested, including an empty name, a party size of 0, an invalid ticket number, and a nonexistent ticket number.

The customer position was also tested with automatic updates after a party ahead was removed. Ticket persistence was tested by refreshing the customer page and confirming that the saved ticket and position were restored.

Staff authentication was tested by accessing the staff page without logging in, logging in with the correct credentials, testing an incorrect PIN, viewing the waitlist, removing a party, and logging out.

The staff waitlist API was also protected so unauthenticated requests cannot retrieve the complete waiting list.

## AI Assistance Verification

AI assistance was used during development for suggestions about implementation and configuration. One example was the TypeScript compiler configuration: an AI suggestion initially used `allowImportingTsExtensions`, but `npm run build` reported that this option was invalid for the current build configuration; the error was checked directly and the configuration was changed to use `rewriteRelativeImportExtensions`, after which `npm run build` completed successfully.

