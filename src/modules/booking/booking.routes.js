import { Router } from "express";

import { verifyJWT } from "../../common/middlewares/auth.middleware.js";
import {
  createBooking,
  createLegacyBookingHandler,
  getMyBookings,
  listSeats,
  listSeatsLegacy,
} from "./booking.controller.js";

const router = Router();

router.get("/seats", listSeatsLegacy);
router.put("/:id/:name", createLegacyBookingHandler);

router.get("/api/seats", listSeats);
router.post("/api/bookings", verifyJWT, createBooking);
router.get("/api/bookings/me", verifyJWT, getMyBookings);

export default router;
