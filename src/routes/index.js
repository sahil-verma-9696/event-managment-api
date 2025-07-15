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

router.get("/event-stats/:id", eventStats);
router.get("/get-events-details/:id", getEventsDetails);
router.get("/list-upcoming-events", listUpcomingEvents);

router.post("/create-event", createEvent);
router.post("/create-user", createUser);
router.post("/register-for-event", registerForEvent);
router.post("/cancell-registration", cancellRegistration);

export default router;
