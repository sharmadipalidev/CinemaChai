import ApiError from "../../common/utils/api-error.js";
import ApiResponse from "../../common/utils/api-response.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import {
  createLegacyBooking,
  createProtectedBooking,
  getAllSeats,
  getBookingsForUser,
} from "./booking.model.js";

const listSeats = asyncHandler(async (req, res) => {
  const seats = await getAllSeats();
  return ApiResponse.ok(res, "Seats fetched successfully", seats);
});

const listSeatsLegacy = asyncHandler(async (req, res) => {
  const seats = await getAllSeats();
  return res.status(200).json(seats);
});

const validateSeatId = (seatId) => {
  const parsedSeatId = Number(seatId);

  if (!Number.isInteger(parsedSeatId) || parsedSeatId <= 0) {
    throw ApiError.badRequest("seatId must be a positive integer");
  }

  return parsedSeatId;
};

const createBooking = asyncHandler(async (req, res) => {
  const seatId = validateSeatId(req.body.seatId);
  const bookedName =
    req.user.full_name ||
    req.user.name ||
    req.user.email ||
    "Authenticated User";

  const booking = await createProtectedBooking({
    seatId,
    userId: req.user.id,
    bookedName,
  });

  return ApiResponse.created(res, "Seat booked successfully", booking);
});

const createLegacyBookingHandler = asyncHandler(async (req, res) => {
  const seatId = validateSeatId(req.params.id);
  const bookedName = req.params.name?.trim();

  if (!bookedName) {
    throw ApiError.badRequest("name is required");
  }

  await createLegacyBooking({
    seatId,
    bookedName,
  });

  return res.status(200).json({
    success: true,
    message: "Seat booked successfully",
  });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await getBookingsForUser(req.user.id);
  return ApiResponse.ok(res, "Bookings fetched successfully", bookings);
});

export {
  listSeats,
  listSeatsLegacy,
  createBooking,
  createLegacyBookingHandler,
  getMyBookings,
};
