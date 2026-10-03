# Multi-Vendor E-Commerce Platform

A full-stack multi-vendor e-commerce web application built using React, Node.js, Express.js and MongoDB.

The platform supports three roles:

- Customer
- Seller
- Admin

Each role has different permissions and features.

---

## 🚀 Features

### Customer

- User registration and login
- Browse products
- Search products
- Filter products by category
- Sort products
- Product details
- Shopping cart
- Wishlist
- Checkout
- Cash on Delivery
- Order history
- Cancel orders
- Product reviews and ratings
- Profile management
- Change password

### Seller

- Seller registration
- Seller approval by admin
- Seller dashboard
- Add products
- Edit products
- Delete products
- Manage product stock
- View seller orders
- Update order status
- View sales statistics

### Admin

- Admin dashboard
- View users
- View sellers
- Approve/reject sellers
- Manage products
- Delete products
- Manage categories
- Manage customer orders
- Update order status
- View platform statistics

---

## 🛠️ Technologies

### Frontend

- React.js
- React Router
- Axios
- CSS
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

### Development Tools

- Git
- GitHub
- VS Code
- MongoDB

---

## 📁 Project Structure

```text
multi-vendor-ecommerce/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md