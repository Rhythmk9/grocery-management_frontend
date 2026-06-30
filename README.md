# GROCIFY - Admin Panel 🛒

GROCIFY is a web-based Grocery Management System built for store administrators to manage stock, billing, and order history through a simple, easy-to-use dashboard.

This repository contains the **Admin Side** of the application, which allows the store admin to log in securely and manage day-to-day grocery store operations.

---

##  Features

- **Admin Login** — Secure username/password based login screen for store administrators.
- **Stock Management** — View and manage current stock levels of grocery items.
- **Billing** — Generate and manage customer bills directly from the dashboard.
- **Previous Orders** — View a history of past orders placed.
- **Logout** — Securely log out of the admin session.


## Tech Stack

- **HTML5** — Page structure
- **CSS3** — Styling and layout (`styles.css`)
- **JavaScript** — Client-side functionality (`script.js`)

---

## 📂 Project Structure

```
grocery-management/
│
├── index.html        # Admin login page
├── dashboard.html     # Admin dashboard (stock, billing, orders)
├── script.js          # Frontend logic for dashboard interactions
├── styles.css         # Stylesheet for login & dashboard pages
└── README.md          # Project documentation
```

---

##  Getting Started

Since this is a frontend-only project, no server setup is required.

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/grocify-admin.git
   ```
2. Open the project folder
   ```bash
   cd grocify-admin
   ```
3. Open `index.html` in your browser (do **not** run `script.js` directly with Node.js, since it relies on the browser's `document` object).

---

##  Usage

1. Open the login page and enter admin credentials.
2. Upon successful login, you will be redirected to the **Admin Dashboard**.
3. Use the navigation buttons to switch between:
   - **Stock Left** – view current inventory
   - **Billing** – generate bills for customers
   - **Previous Orders** – review past transactions
4. Click **Logout** to end the session.

---

## Future Enhancements

- Backend integration with a database (MySQL/MongoDB) for persistent storage
- Role-based access for multiple admins
- Sales analytics and reports
- Low-stock alerts and notifications

