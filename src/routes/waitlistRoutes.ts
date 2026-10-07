import { Router } from "express";
import {
  addToWaitlist,
  getWaitlist,
  getPartiesAhead,
  removeFromWaitlist
} from "../services/waitlistService.ts";

const router = Router();

function requireStaff(
  req: {
    session: {
      authenticated?: boolean;
    };
  },
  res: {
    status: (code: number) => {
      json: (body: unknown) => unknown;
    };
  },
  next: () => void
) {
  if (req.session.authenticated !== true) {
    res.status(401).json({
      error: "Staff authentication required"
    });

    return;
  }

  next();
}

router.get("/", requireStaff, (_req, res) => {
  const waitlist = getWaitlist();

  res.json(waitlist);
});

router.get("/:ticketNumber/ahead", (req, res) => {
  const ticketNumber = Number(req.params.ticketNumber);

  if (!Number.isInteger(ticketNumber) || ticketNumber <= 0) {
    return res.status(400).json({
      error: "Invalid ticket number"
    });
  }

  const partiesAhead = getPartiesAhead(ticketNumber);

  if (partiesAhead === null) {
    return res.status(404).json({
      error: "Ticket not found"
    });
  }

  res.json({
    ticketNumber,
    partiesAhead
  });
});

router.delete("/:ticketNumber", requireStaff, (req, res) => {
  const ticketNumber = Number(req.params.ticketNumber);

  if (!Number.isInteger(ticketNumber) || ticketNumber <= 0) {
    return res.status(400).json({
      error: "Invalid ticket number"
    });
  }

  const removed = removeFromWaitlist(ticketNumber);

  if (!removed) {
    return res.status(404).json({
      error: "Ticket not found"
    });
  }

  res.status(204).send();
});

router.post("/", (req, res) => {
  const { name, partySize } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "Name is required"
    });
  }

  if (
    typeof partySize !== "number" ||
    !Number.isInteger(partySize) ||
    partySize <= 0
  ) {
    return res.status(400).json({
      error: "Party size must be a positive whole number"
    });
  }

  const result = addToWaitlist(name.trim(), partySize);

  res.status(201).json(result);
});

export default router;