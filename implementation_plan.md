# Equipment & Machinery Rental Marketplace Implementation Plan

## Overview
We will implement a peer-to-peer marketplace where users can rent out agricultural equipment and machinery. This feature includes listing equipment, browsing available items, and a secure booking system that prevents double bookings.

## Features
1.  **Equipment Listing**: Users can list machinery (Tractors, Harvesters, etc.) with photos, daily rates, and descriptions.
2.  **Marketplace View**: A dedicated page for users to browse and filter available equipment.
3.  **Booking System**: A calendar-based reservation system.
4.  **Double Booking Prevention**: Logic to ensure equipment cannot be booked for overlapping dates.
5.  **Dashboard Management**:
    *   **Owners**: Manage listings and view/approve incoming booking requests.
    *   **Renters**: View booking history and status.

## Technical Implementation Steps

### 1. Backend (Server)

#### A. New Models
- **`Equipment` Model**:
  - Fields: `name`, `description`, `category` (e.g., Tractor, Tool), `dailyRate` (Number), `images` (Array), `owner` (Ref User), `location`, `available` (Boolean).
- **`Rental` Model**:
  - Fields: `equipment` (Ref Equipment), `renter` (Ref User), `startDate`, `endDate`, `totalCost`, `status` (pending, confirmed, completed, cancelled).

#### B. API Routes
- **`equipment.route.js`**:
  - `POST /` - Create listing.
  - `GET /` - Get all listeners.
  - `GET /:id` - Get details.
  - `PUT /:id` - Update listing.
  - `DELETE /:id` - Delete listing.
- **`rental.route.js`**:
  - `POST /book` - Create a booking (includes overlap check).
  - `GET /my-rentals` - Get bookings made by the user.
  - `GET /owner-requests` - Get bookings for the user's equipment.
  - `PUT /:id/status` - Approve/Reject booking.

#### C. Controllers
- **`rental.controller.js`**:
  - **Crucial Logic**: `checkAvailability(equipmentId, start, end)` must return false if any confirmed booking overlaps.

### 2. Frontend (Client)

#### A. State Management (Redux)
- **`equipmentSlice.js`**: specialized async thunks for fetching equipment and rentals.

#### B. Pages/Components
- **`RentalMarketplace.jsx`**: Main gallery view.
- **`EquipmentDetails.jsx`**: Individual item view with a "Book Now" section containing a date picker.
- **`AddEquipment.jsx`**: Form for listing new functionality.
- **`RentalDashboard.jsx`**: Tabbed view for "My Listings", "Incoming Requests", and "My Bookings".

### 3. Integration
- Add "Rentals" to main navigation.
- Ensure only authenticated users can book or list.
