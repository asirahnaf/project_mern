# Admin Dashboard Implementation Plan

## Overview
We will create a comprehensive Admin Dashboard for the AgriConnect platform. This dashboard will be a restricted area accessible only to users with the `admin` role. It will allow managing users, products, orders, and setting daily crop market prices.

## Features
1.  **Dashboard Overview**: Statistics (Total Users, Total Sales, Active Products).
2.  **User Management**: View all users, delete/block users (e.g., specific farmers or buyers).
3.  **Product Management**: View all listings, remove inappropriate products, or update details.
4.  **Market Price Management**: A new feature allowing Admins to set "Daily Market Prices" for crops, which can serve as a reference for farmers and buyers.
5.  **Order Management**: View transaction history and status.
6.  **Notification Center**: Broadcast system-wide alerts (already partially implemented).

## Technical Implementation Steps

### 1. Backend (Server)

#### A. New Models
- **`MarketPrice` Model**: To store daily prices for crops.
  - Fields: `cropName` (String), `price` (Number), `date` (Date).

#### B. API Routes (`admin.route.js`)
We will add the following endpoints protected by `verifyAdmin`:
- `GET /api/admin/stats` - Fetch overall system stats.
- `GET /api/admin/users` - List all users.
- `DELETE /api/admin/users/:id` - Delete a user.
- `GET /api/admin/products` - List all products.
- `DELETE /api/admin/products/:id` - Delete a product.
- `GET /api/admin/prices` - Get current market prices.
- `POST /api/admin/prices` - Set/Update market prices.
- `GET /api/admin/orders` - List recent orders.

#### C. Controllers (`admin.controller.js`)
- Implement logic for the above routes.
- Reuse efficient querying (e.g., `User.find()`, `Product.find()`).

### 2. Frontend (Client)

#### A. Layout (`AdminLayout.tsx`)
- A separate layout with a sidebar navigation suited for management tasks.
- Links: Dashboard, Users, Products, Market Prices, Orders, Notifications.

#### B. Components/Pages
- **`AdminDashboard.jsx`**: Cards showing key metrics.
- **`ManageUsers.jsx`**: A table displaying users with "Delete" buttons.
- **`ManageProducts.jsx`**: A table displaying products with images and "Remove" options.
- **`ManagePrices.jsx`**: A form to add/update daily rates for crops (e.g., Potato, Rice).
- **`ManageOrders.jsx`**: List of all orders.

### 3. Integration
- Add the `/admin/*` routes to the main `App.jsx` or router configuration.
- Ensure the `AdminLayout` wraps these routes and checks for `user.role === 'admin'`.

## User Experience (UX)
- **Design**: Clean, data-heavy interface. Use tables for data and cards for stats.
- **Feedback**: Success toasts when an admin deletes a user or updates a price.
- **Security**: Redirect non-admins to the home page if they try to access `/admin`.
