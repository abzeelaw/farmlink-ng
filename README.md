# 🌱 Produce Marketplace

> A modern digital marketplace connecting farmers directly with buyers, making fresh agricultural produce easier to discover, purchase, and manage.

![Produce Marketplace](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📖 Overview

**Produce Marketplace** is a responsive web application designed to create a direct connection between farmers and buyers.

The platform provides farmers with digital tools to showcase their agricultural products, manage their farm profiles, add and manage products, and process customer orders.

Buyers can explore available produce, discover farmers, view detailed product information, add products to their cart, complete checkout, and manage their orders.

The application is designed with a focus on **simplicity, accessibility, responsive design, and a better digital marketplace experience for agricultural products.**

---

## 🎯 Problem Statement

Agricultural producers often face challenges reaching customers directly, while consumers may struggle to discover fresh produce from reliable farmers.

Traditional agricultural supply chains can involve multiple intermediaries, which may reduce farmers' profit margins and make it difficult for buyers to know where their products originate.

There is therefore a need for a digital platform that can:

- Connect farmers directly with buyers.
- Give farmers an online presence.
- Make agricultural products easier to discover.
- Simplify purchasing and checkout.
- Provide better visibility into orders.
- Create a more transparent marketplace experience.

---

## 💡 Solution

Produce Marketplace provides a centralized digital platform where farmers can list and manage their agricultural products while buyers can browse and purchase those products.

The platform provides separate experiences for:

- 🛒 **Buyers**
- 👨‍🌾 **Farmers**
- 🛡️ **Administrators**

This creates a structured marketplace where each user can access the functionality relevant to their role.

---

# ✨ Key Features

## 🛒 Buyer Features

### Marketplace

Buyers can browse agricultural products available on the platform.

Features include:

- Product discovery
- Product categories
- Product cards
- Product information
- Farmer information
- Responsive marketplace layout

### Product Details

Buyers can view detailed information about individual products, including:

- Product name
- Product description
- Product price
- Product image
- Farmer information
- Product availability

### Shopping Cart

Buyers can:

- Add products to their cart
- Increase product quantities
- Decrease product quantities
- Remove products
- View cart totals
- Review their order before checkout

### Checkout

The checkout experience allows buyers to:

- Review their cart
- Confirm order information
- Review order totals
- Submit their order

### Orders

Buyers can:

- View previous orders
- View individual order details
- Track their order information

---

# 👨‍🌾 Farmer Features

## Farmer Dashboard

Farmers have access to a dedicated dashboard for managing their marketplace activities.

The dashboard provides a centralized location for farmer-related operations.

## Farm Profile

Farmers can manage their farm information and maintain a profile that buyers can view.

## Product Management

Farmers can:

- Add new products
- View their products
- Manage existing products
- Update product information
- Manage product availability

## Farmer Orders

Farmers can access orders associated with their products and manage their order workflow.

---

# 🛡️ Administrator Features

Administrators have access to administrative functionality for managing marketplace participants.

Current administrative functionality includes:

- Farmer management
- Viewing registered farmers
- Managing farmer-related information

The administrative area is separated from the public marketplace experience.

---

# 🔐 Authentication

The application provides authentication functionality for users.

Authentication includes:

- User registration
- User login
- Authenticated application access
- User-specific experiences

Authentication and database functionality are powered by **Supabase**.

---

# 🌙 Dark Mode

Produce Marketplace supports both light and dark themes.

The theme system is designed to provide a consistent visual experience across the application while maintaining:

- Readability
- Contrast
- Accessible text colors
- Consistent card backgrounds
- Responsive navigation
- Theme-aware UI components

---

# 📱 Responsive Design

The application is designed to work across different screen sizes.

Supported layouts include:

- 📱 Mobile devices
- 📲 Tablets
- 💻 Laptops
- 🖥️ Desktop screens

Responsive layouts are implemented using Tailwind CSS utility classes and responsive breakpoints.

---

# 🧰 Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface development |
| Vite | Development environment and build tool |
| JavaScript | Application logic |
| Tailwind CSS | Styling and responsive design |
| React Router | Client-side routing |
| Lucide React | UI icons |
| React Hot Toast | Notifications |

## Backend & Database

| Technology | Purpose |
|---|---|
| Supabase | Backend services |
| PostgreSQL | Database |
| Supabase Auth | Authentication |

## Development Tools

- Git
- GitHub
- Visual Studio Code
- npm
- Browser Developer Tools

---

# 🏗️ Application Architecture

The application follows a component-based React architecture.

The project separates:

- Pages
- Components
- Layouts
- Authentication
- Context/state management
- Database configuration
- Public pages
- Farmer pages
- Admin pages

A simplified structure is shown below:

```text
src/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── marketplace/
│   └── ...
│
├── layouts/
│   └── RootLayout.jsx
│
├── pages/
│   │
│   ├── admin/
│   │   └── Farmers.jsx
│   │
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── cart/
│   │   └── Cart.jsx
│   │
│   ├── checkout/
│   │   └── Checkout.jsx
│   │
│   ├── farmer/
│   │   ├── FarmerDashboard.jsx
│   │   ├── FarmerOrders.jsx
│   │   ├── MyProducts.jsx
│   │   ├── AddProduct.jsx
│   │   └── FarmProfile.jsx
│   │
│   ├── orders/
│   │   ├── MyOrders.jsx
│   │   └── OrderDetails.jsx
│   │
│   └── public/
│       ├── Home.jsx
│       ├── Marketplace.jsx
│       ├── About.jsx
│       ├── Contact.jsx
│       ├── Farmers.jsx
│       ├── FarmerProfile.jsx
│       └── ProductDetails.jsx
│
├── context/
│   └── ...
│
├── lib/
│   └── supabase.js
│
├── App.jsx
├── main.jsx
└── index.css