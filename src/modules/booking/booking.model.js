import ApiError from "../../common/utils/api-error.js";
import { query, withTransaction } from "../../common/config/db.js";

const DEFAULT_MOVIE_NAME = "Dhurandhar The Revenge";
const DEFAULT_SEAT_COUNT = Number(process.env.DEFAULT_SEAT_COUNT || 20);

const initializeBookingSchema = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS seats (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      isbooked INT NOT NULL DEFAULT 0
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE SET NULL,
      seat_id INT NOT NULL UNIQUE REFERENCES seats(id) ON DELETE CASCADE,
      movie_name VARCHAR(255) NOT NULL,
      booked_name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const seatCountResult = await query(
    "SELECT COUNT(*)::int AS count FROM seats",
  );

  if (seatCountResult.rows[0].count === 0) {
    await query(
      `INSERT INTO seats (isbooked)
       SELECT 0
       FROM generate_series(1, $1)`,
      [DEFAULT_SEAT_COUNT],
    );
  }
};

const getAllSeats = async () => {
  const result = await query(
    "SELECT id, name, isbooked FROM seats ORDER BY id ASC",
  );
  return result.rows;
};

const getBookingsForUser = async (userId) => {
  const result = await query(
    `SELECT b.id,
            b.user_id,
            b.seat_id,
            b.movie_name,
            b.booked_name,
            b.created_at
     FROM bookings b
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId],
  );

  return result.rows;
};

const createProtectedBooking = async ({ seatId, userId, bookedName }) => {
  return withTransaction(async (client) => {
    const seatResult = await client.query(
      `SELECT id, isbooked
       FROM seats
       WHERE id = $1
       FOR UPDATE`,
      [seatId],
    );

    if (seatResult.rowCount === 0) {
      throw ApiError.notFound("Seat not found");
    }

    if (seatResult.rows[0].isbooked) {
      throw ApiError.conflict("Seat already booked");
    }

    await client.query(
      `UPDATE seats
       SET isbooked = 1,
           name = $2
       WHERE id = $1`,
      [seatId, bookedName],
    );

    const bookingResult = await client.query(
      `INSERT INTO bookings (user_id, seat_id, booked_name, movie_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, seat_id, booked_name, movie_name, created_at`,
      [userId, seatId, bookedName, DEFAULT_MOVIE_NAME],
    );

    return bookingResult.rows[0];
  });
};

const createLegacyBooking = async ({ seatId, bookedName }) => {
  return withTransaction(async (client) => {
    const seatResult = await client.query(
      `SELECT id, isbooked
       FROM seats
       WHERE id = $1
       FOR UPDATE`,
      [seatId],
    );

    if (seatResult.rowCount === 0) {
      throw ApiError.notFound("Seat not found");
    }

    if (seatResult.rows[0].isbooked) {
      throw ApiError.conflict("Seat already booked");
    }

    await client.query(
      `UPDATE seats
       SET isbooked = 1,
           name = $2
       WHERE id = $1`,
      [seatId, bookedName],
    );

    return {
      seatId,
      bookedName,
    };
  });
};

export {
  DEFAULT_MOVIE_NAME,
  initializeBookingSchema,
  getAllSeats,
  getBookingsForUser,
  createProtectedBooking,
  createLegacyBooking,
};
