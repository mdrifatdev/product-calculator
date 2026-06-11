# 🚀 Product Calculator Pro

A premium, single-page web application (SPA) with a glassmorphic dashboard design for managing product inventory values, sales states, and stock calculations. Built with Node.js, Express, MongoDB, and modern Vanilla CSS.

---

## ✨ Features

- **Dashboard Statistics**:
  - **Inventory Value**: Sum of totals of all available/unsold items.
  - **Total Sales**: Sum of totals of all sold items.
  - **Available Stock**: Count of active items in stock.
  - **Products Sold**: Count of sold items.
- **Dynamic Search & Filtering**: Real-time name search and filter tabs (All, Available, Sold).
- **Sorting Options**: Sort inventory by date added, unit price, and quantity.
- **Glassmorphic UI**: Beautiful dark mode theme using blur effects, harmonious color accents, and smooth hover/modal entry animations.
- **Modals for Actions**: Custom-built modal popups with form validation, replacing native browser prompts for adding, editing, selling, and deleting products.
- **Real-time Cost Preview**: Displays calculated totals as you type price/quantity values in the form.
- **Toast Notifications**: Modern status toasts for UI alerts.
- **Auto-Calculated Totals**: Backend server validates inputs and automatically computes `total = price * quantity` to keep data robust.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Custom properties, CSS Grid/Flexbox, backdrop filters, keyframe animations), Google Fonts (Outfit).
- **Backend**: Node.js, Express.js (v5), MongoDB/Mongoose (Object Data Modeling).
- **Hosting / Deployments**: Setup for deploying static frontend files to GitHub Pages and the backend API to Render.

---

## 💾 Database Schema

The MongoDB collection uses the following **Product** schema definition (`models/Product.js`):

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | - | Name of the product (whitespaces auto-trimmed) |
| `price` | Number | Yes | - | Positive unit price of the product |
| `quantity` | Number | Yes | - | Positive integer quantity |
| `total` | Number | Yes | - | Computed total value (`price * quantity`) |
| `sold` | Boolean | Yes | `false` | Whether the product has been sold |
| `sellDate` | Date | No | - | Timestamp when the product was marked sold |
| `sellNote` | String | No | - | Optional note containing sale comments |

---

## 🔌 API Reference

### Products

#### 1. Add Product
- **URL**: `/api/products`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "Mechanical Keyboard",
    "price": 89.99,
    "quantity": 5
  }
  ```
- **Response**: `201 Created`

#### 2. Get All Products
- **URL**: `/api/products`
- **Method**: `GET`
- **Response**: `200 OK` (Array of products sorted newest first)

#### 3. Update Product Details (Edit)
- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Body** (Optional fields):
  ```json
  {
    "name": "RGB Mechanical Keyboard",
    "price": 95.00,
    "quantity": 4
  }
  ```
- **Response**: `200 OK` (Updated product object)

#### 4. Mark Product as Sold
- **URL**: `/api/products/:id/sell`
- **Method**: `PUT`
- **Body**:
  ```json
  {
    "sellNote": "Sold to office client"
  }
  ```
- **Response**: `200 OK` (Updated product object with `sold: true`)

#### 5. Delete Product
- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Response**: `200 OK`

---

## ⚙️ Local Development Setup

### Backend Setup
1. Open a terminal and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```
3. Start the local server:
   ```bash
   node server.js
   ```
   The backend API will run on [http://localhost:5000](http://localhost:5000).

### Frontend Setup
1. Simply double-click `index.html` to open it in a browser, or run a local static file server.
2. The frontend script dynamically detects if it is running on `localhost`/`127.0.0.1` and will connect to your local backend. Otherwise, it defaults to the production Render API.
