# BookNest — Online Bookstore Management System

**Coursework Project:** SE1020 Object Oriented Programming  
**Application Type:** Responsive Web Application (Customer Storefront & Administrative Management System)  
**Technology Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+), Bootstrap 5, Bootstrap Icons  

---

## 1. Project Overview

**BookNest** is a modern, responsive online bookstore and bookstore management system designed for students, book enthusiasts, and academic researchers. It fulfills all requirements of a full-scale university OOP project:

- **Customer Storefront:**
  - Discover books with live search, category browsing, and price/title sorting.
  - Interactive book details with specs, availability, ratings, and customer reviews.
  - Shopping cart with live quantity adjustment, subtotal/shipping calculation.
  - Complete checkout simulation with doorstep Cash on Delivery (COD) and order generation.
  - Order tracking portal with order status lifecycle (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
  - User account management and profile customization.
- **Admin Management Portal (Full CRUD):**
  - **Dashboard:** Real-time business metrics (Total Books, Users, Orders, Revenue) and order status distribution.
  - **Book Management:** Create, Read, Update, Delete books with validation (price, stock, ISBN, category).
  - **User Management:** Create, Read, Update, Delete customer/staff/admin accounts.
  - **Category Management:** Create, Read, Update, Delete bookstore genres.
  - **Order Management:** Inspect order items, change order lifecycle statuses, cancel orders.
  - **Review Management:** Moderate customer feedback and rating scores (1-5 stars).

---

## 2. Directory & File Structure

```text
BookNest/
├── index.html              # Customer Homepage (Hero, Featured, Bestsellers, Categories)
├── books.html              # Browse Books (Live Search, Category Filter, Sorting)
├── book-details.html       # Book Details (Cover, Specs, Quantity, Cart, Reviews)
├── cart.html               # Shopping Cart (Live math, Quantity controls, Removal)
├── checkout.html           # Checkout (Contact, Delivery Address, COD demo, Order placement)
├── orders.html             # Customer Orders (History, Status badges, Detail inspection)
├── profile.html            # Customer Profile (Contact information, Order metrics)
├── login.html              # Login (Validation, Password toggle, Demo quick-fill buttons)
├── register.html           # Account Registration (Validation, Match checking)
├── admin/
│   ├── dashboard.html      # Admin Dashboard (KPI Metrics, Status counts, Recent tables)
│   ├── books.html          # Book Management CRUD (Add, Edit, View, Delete)
│   ├── users.html          # User Management CRUD (Add, Edit, View, Delete)
│   ├── categories.html     # Category Management CRUD (Add, Edit, View, Delete)
│   ├── orders.html         # Order Management CRUD (View, Status update, Delete)
│   └── reviews.html        # Review Management CRUD (View, Edit rating, Delete)
├── css/
│   └── style.css           # Custom BookNest Stylesheet (Navy palette, Typography, Responsive)
├── js/
│   ├── data.js             # Central Data Store Engine & Seed Data (LocalStorage CRUD)
│   ├── script.js           # Customer Frontend Logic (Cart, Search, Filters, Forms)
│   └── admin.js            # Admin Frontend Logic (Dashboard KPIs, 5 CRUD modules)
└── README.md               # Complete Project & Viva Documentation
```

---

## 3. How to Run Locally

You do not need any build tools (npm/webpack) to run BookNest.

### Option A: Direct Browser Launch
1. Navigate to the `BookNest` directory in Windows File Explorer.
2. Double-click `index.html` to open it in Chrome, Edge, Firefox, or Brave.
3. All features work immediately via local storage and CDN dependencies.

### Option B: Local Python HTTP Server (Recommended)
Open PowerShell in the project directory:
```powershell
python -m http.server 8000
```
Then open your browser at:
```text
http://localhost:8000/BookNest/index.html
```

### Option C: VS Code Live Server
Right-click `BookNest/index.html` and select **"Open with Live Server"**.

---

## 4. Demo Accounts for Viva Presentation

Quick-fill buttons are provided on `login.html`:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Customer** | `amaya@gmail.com` | `password123` | Browsing, Cart, Orders, Profile |
| **Admin** | `admin@booknest.lk` | `admin123` | Storefront + Full Admin Portal CRUD |

---

## 5. SE1020 Java OOP Backend Integration Architecture

During your SE1020 Object Oriented Programming viva, lecturers often ask:  
*"How will this frontend connect to your Java OOP backend?"*

### A. Mapping JavaScript Data Store to Java Classes

In the frontend, records are managed inside `js/data.js` via the `BookNestStore` class. This directly mirrors standard Java OOP classes:

#### 1. Entity Models (`model/`)
```java
// Book.java
public class Book {
    private String id;
    private String title;
    private String author;
    private String category;
    private String isbn;
    private double price;
    private int quantity;
    private double rating;
    private String cover;
    private String description;

    // Constructors, Getters, and Setters
}
```

```java
// Order.java
public class Order {
    private String id;
    private String customerId;
    private String customerName;
    private String date;
    private String deliveryAddress;
    private List<OrderItem> items;
    private double total;
    private String status; // Pending, Processing, Shipped, Delivered, Cancelled
}
```

```java
// User.java & Subclasses demonstrating Inheritance & Polymorphism
public abstract class User {
    protected String id;
    protected String name;
    protected String email;
    protected String phone;
    protected String role;
}

public class Customer extends User {
    private String deliveryAddress;
}

public class Admin extends User {
    private int adminPrivilegeLevel;
}
```

---

### B. File I/O Architecture for Java Coursework
If your lecturer requires Java File Read/Write (e.g. `books.txt` or `orders.dat`), explain this architecture:

```text
[Frontend Browser] 
      │  (JSON via HTTP fetch)
      ▼
[Java Servlet / Controller] (e.g., BookController.java)
      │  (OOP Method invocation)
      ▼
[Java Service Layer] (e.g., BookServiceImpl.java)
      │  (Data Access Object pattern)
      ▼
[Java File DAO] (e.g., BookFileDAO.java)
      │  (BufferedReader / BufferedWriter / ObjectInputStream)
      ▼
[books.txt / orders.txt]
```

### C. Replacing LocalStorage with REST API
In `js/data.js`, the synchronous methods can be converted to asynchronous `fetch()` calls:

```javascript
// Current LocalStorage Implementation:
static getBooks() {
    return JSON.parse(localStorage.getItem(this.KEYS.BOOKS)) || [];
}

// Future Java REST API Integration:
static async getBooks() {
    const response = await fetch("http://localhost:8080/api/books");
    return await response.json();
}
```

---

## 6. Viva Presentation Checklist & Answers

1. **Why is data stored in `localStorage` right now?**  
   *Answer:* It provides an offline, self-contained demonstration of all stateful features (cart calculations, persistent CRUD actions, order generation) without requiring the examiner to install a database or web server.

2. **How is form validation handled?**  
   *Answer:* Both HTML5 constraint validation (`required`, `type="email"`, `min="0"`) and JavaScript custom logic in `script.js` and `admin.js` prevent negative prices, empty entries, and mismatched passwords.

3. **What happens if a book cover image URL is broken or offline?**  
   *Answer:* All book image tags include an `onerror` handler pointing to `UIUtils.getFallbackCoverSvg()`, which generates a clean SVG book cover on the fly.
