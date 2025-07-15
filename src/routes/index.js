import { Router } from "express";

import {
  createEvent,
  getEventsDetails,
  listUpcomingEvents,
  registerForEvent,
  cancellRegistration,
  eventStats,
  createUser,
} from "../controllers/index.js";

const router = Router();

router.get("/events/:id/stats", eventStats);
router.get("/events/:id", getEventsDetails);
router.get("/events/upcoming", listUpcomingEvents);

router.post("/events", createEvent);
router.post("/users", createUser);
router.post("/events/register", registerForEvent);
router.delete("/events/cancel", cancellRegistration);

export default router;
