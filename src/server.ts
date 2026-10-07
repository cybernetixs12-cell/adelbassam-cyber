import express from "express";
import session from "express-session";
import db from "./db/database.ts";
import waitlistRoutes from "./routes/waitlistRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
  session({
    secret: "restaurant-waitlist-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax"
    }
  })
);

app.use(express.static("src/public"));

app.use("/api/auth", authRoutes);

app.use("/api/waitlist", waitlistRoutes);

app.get("/api/health", (_req, res) => {
  const result = db
    .prepare("SELECT COUNT(*) AS count FROM waitlist")
    .get();

  res.json({
    status: "ok",
    database: result
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});