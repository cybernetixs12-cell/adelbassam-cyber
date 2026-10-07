import express from "express";
import db from "./db/database.ts";
import waitlistRoutes from "./routes/waitlistRoutes.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("src/public"));

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