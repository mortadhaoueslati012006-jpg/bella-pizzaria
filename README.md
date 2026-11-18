# 🍕 Bella Pizzaria

A full-stack pizzeria ordering web application built with HTML, CSS, JavaScript, PHP and MySQL.

## ✨ Features

### Customer Side
- 🛒 Browse the menu by category (Pizzas, Drinks, Desserts, etc.)
- 🛍️ Add items to cart and place orders
- 🚚 Choose between delivery and pickup
- 🏷️ Apply promo codes for discounts
- 📋 View order history

### Admin Dashboard
- 📊 Sales statistics (daily, monthly, yearly)
- 🍕 Manage menu items (add, edit, delete)
- 📦 View and manage customer orders
- 🎟️ Manage promo codes
- 👥 Manage registered users

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | PHP 5.3 |
| Database | MySQL 5.1 |
| Server | Apache (EasyPHP) |

## 🚀 Getting Started

### Requirements
- [EasyPHP](https://www.easyphp.org/) (or any LAMP/WAMP stack with PHP 5.3+ and MySQL)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mortadhaoueslati012006-jpg/bella-pizzaria.git
   ```

2. **Copy files to your web server root**
   ```
   Copy all files into: EasyPHP/www/bella-pizzaria/
   ```

3. **Import the database**
   - Open phpMyAdmin at `http://127.0.0.1:8888/phpmyadmin`
   - Create a new database named `pizzeria1_db`
   - Import `pizzeria1_db.sql`

4. **Configure the database connection** in `api.php` if needed:
   ```php
   $host = "localhost";
   $username = "root";
   $password = "";
   $database = "pizzeria1_db";
   ```

5. **Open the app** in your browser:
   ```
   http://127.0.0.1:8888/bella-pizzaria/
   ```

## 📁 Project Structure

```
bella-pizzaria/
├── index.html          # Main app entry point
├── style.css           # All styles
├── script.js           # Frontend logic (menu, cart, orders)
├── notification.js     # Notification system
├── api.php             # Backend API (PHP + MySQL)
├── pizzeria1_db.sql    # Database schema and seed data
└── pizza_icon.png      # App icon
```

## 📄 License

This project is for educational purposes.
