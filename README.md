# Cinema Chai Ticket Booking

Cinema Chai is a lightweight cinema seat booking application built with Express.js and a frontend served from a single-page HTML interface. It includes user authentication, route-based navigation, and real-time seat updates after booking.

## Features

- Login and registration flow
- Route-based navigation for `/login`, `/register`, and `/booking`
- Persistent user authentication using `localStorage`
- Real-time seat booking updates without page refresh
- Booked seat tooltip showing who booked the seat
- Server-driven seat data via `/seats` endpoint
- Responsive UI for desktop and smaller screens

## Project structure

- `index.mjs` - main server bootstrap file
- `package.json` - npm scripts, dependencies, and metadata
- `public/` - static frontend files
  - `index.html` - main app UI and client-side logic
- `src/` - backend application source
  - `app.js` - Express application setup and route mounting
  - `modules/` - feature modules for auth, booking, and users

## Requirements

- Node.js 18 or later
- Docker & Docker Compose for the backend database
- npm or yarn for package installation

## Setup and installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the database stack:

   ```bash
   npm run db:up
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Visit the app in your browser:

   ```bash
   http://localhost:8080/login
   ```

## Usage

- `/login` - user sign in route
- `/register` - user registration route
- `/booking` - seat selection and booking screen (requires login)

### Registering a new user

- Open `/register`
- Enter a full name, Gmail address, password, and confirm password
- After registration, the user is redirected to `/booking`

### Booking a seat

- Click an available seat in the booking screen
- The seat immediately updates to booked state with red styling
- Hovering a booked seat displays the booking tooltip

## Backend behavior

- Static files are served from the `public/` directory
- Authentication is currently handled client-side using local storage
- Seat status is loaded from the `/seats` API endpoint
- Booking requests are sent to the server and reflected live in the UI

## Scripts

- `npm start` - run the production server
- `npm run dev` - run the app with `nodemon` for easier development
- `npm run db:up` - start database containers
- `npm run db:down` - stop database containers

## Troubleshooting

- If the app does not load, make sure Docker is running and `npm install` completed successfully.
- If the `/booking` route loads without UI, clear browser storage and log in again.
- If seat data is stale, refresh the app or check the `/seats` endpoint response.

## Notes

- The current implementation uses local storage for current user session persistence.
- The frontend and backend are tightly coupled through `index.html` and `app.js`.
- Authentication behavior and route guards are simplified for a demo-style experience.

## License

This project is provided without warranty and is intended for learning and demonstration purposes.
