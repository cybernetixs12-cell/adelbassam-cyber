import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

const STAFF_USERNAME = "staff";
const STAFF_PIN = "1234";

router.post("/login", (req: Request, res: Response) => {
  const { username, pin } = req.body;

  if (
    username !== STAFF_USERNAME ||
    pin !== STAFF_PIN
  ) {
    return res.status(401).json({
      error: "Invalid username or PIN"
    });
  }

  req.session.authenticated = true;

  res.json({
    message: "Login successful"
  });
});

router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        error: "Could not log out"
      });
    }

    res.status(204).send();
  });
});

router.get("/me", (req: Request, res: Response) => {
  res.json({
    authenticated: req.session.authenticated === true
  });
});

export default router;