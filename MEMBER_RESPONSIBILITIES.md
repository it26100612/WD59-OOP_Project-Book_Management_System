# Member 4: Order Management, Shopping Cart & Checkout

**Course:** SE1020 Object Oriented Programming  
**Module:** Shopping Cart, Checkout & Order Processing Lifecycle  
**Role:** Backend Developer & E-Commerce Transactions Specialist  
**Assigned Directory:** `BookNest_FINAL_DISTRIBUTION/Member_4_Order_Management`  
**Shared GenericDAO Coordinator:** Member 3  

---

## 1. Module Overview & Core Responsibilities

Member 4 is responsible for the entire e-commerce purchasing journey: managing shopping cart items, calculating totals and delivery fees, checkout form validation, placing orders, transitioning order statuses (Pending -> Processing -> Shipped -> Delivered -> Cancelled), and displaying customer order histories.

### Key Responsibilities:
1. **Shopping Cart Management:** Dynamic client-side quantity increments, item removal, and subtotal recalculation.
2. **Checkout Flow & Delivery Address:** Capturing delivery address, phone number, customer notes, and payment mode simulation (Cash on Delivery).
3. **Order Lifecycle & State Transitions:** Processing orders, generating unique IDs (`ORD-XXXX`), and managing administrative status transitions.
4. **Inventory Stock Coordination:** Deducting stock levels for purchased items through Member 2's `BookFileDAO`.
5. **Plain-Text File Persistence:** Managing `backend/data/orders.txt` using Jackson JSON file streaming.
6. **Module-Specific Testing:** Executing and maintaining `backend/test-order-module.ps1` to verify order placement, status updates, and composition integrity.

---

## 2. Master File Allocation for Member 4

| File Relative Path | Type | Primary Role & Description |
| :--- | :--- | :--- |
| `backend/data/orders.txt` | Data / JSON | Plain-text JSON data store containing persisted customer orders and composed line items |
| `backend/src/main/java/com/booknest/model/Order.java` | Java Model | Root aggregate entity modeling an order (`id`, `customerId`, `customerName`, `email`, `phone`, `items`, `total`, `status`, etc.) |
| `backend/src/main/java/com/booknest/model/OrderItem.java` | Java Model | Component entity representing an individual book line item within an order |
| `backend/src/main/java/com/booknest/dao/OrderFileDAO.java` | Java DAO | Plain-text file data access object implementing `GenericDAO<Order, String>` with status updating methods |
| `backend/src/main/java/com/booknest/service/OrderService.java` | Java Service | Business logic layer orchestrating order validation, total calculations, and book stock decrement |
| `backend/src/main/java/com/booknest/controller/OrderController.java` | Java Controller | REST controller publishing endpoints under `/api/orders/**` |
| `BookNest/cart.html` | HTML Frontend | Shopping cart interface showing itemized table, quantity spinners, subtotal, and checkout trigger |
| `BookNest/checkout.html` | HTML Frontend | Multi-step checkout form collecting delivery details and confirming payment method |
| `BookNest/orders.html` | HTML Frontend | Customer order history tracking page with status badges and printable order receipts |
| `BookNest/admin/orders.html` | HTML Admin | Administrative order management dashboard with status dropdowns and order details modals |
| `backend/test-order-module.ps1` | PowerShell | Automated module test suite testing order placement, status lifecycle, and persistence |

---

## 3. Core OOP Concepts Implemented

### A. Composition (Has-A Relationship)
- An `Order` has a composition relationship with `OrderItem`:
  ```java
  public class Order {
      private List<OrderItem> items = new ArrayList<>();
      // Lifecycle of OrderItem is bound to the parent Order
  }
  ```
- If an order is canceled or deleted, its associated line items are encapsulated within that order lifecycle.

### B. Inter-Service Collaboration & Encapsulation
- `OrderService` encapsulates transaction rules: calculating shipping fees (LKR 350 flat rate), validating non-empty item lists, and invoking stock deductions.

### C. Interface Implementation (GenericDAO)
- `OrderFileDAO` implements `GenericDAO<Order, String>` governed by Member 3, fulfilling standard CRUD requirements.

---

## 4. Technical Interface with Member 2 (Book Management)

> [!IMPORTANT]
> **ORDER-TO-BOOK INVENTORY INTERFACE CONTRACT:**
> When an order is placed (`POST /api/orders`):
> 1. Member 4's `OrderService` coordinates with Member 2's `BookFileDAO`.
> 2. For each `OrderItem` in the order:
>    ```java
>    Optional<Book> bookOpt = bookDAO.findById(item.getBookId());
>    if (bookOpt.isPresent()) {
>        Book book = bookOpt.get();
>        boolean stockReduced = book.reduceStock(item.getQuantity());
>        if (stockReduced) {
>            bookDAO.save(book);
>        }
>    }
>    ```
> 3. This guarantees that stock decrement logic remains encapsulated inside Member 2's `Book` class, while Member 4 orchestrates the purchasing workflow.

---

## 5. REST API Endpoints Owned by Member 4

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/orders` | List all orders | None | `List<Order>` |
| `GET` | `/api/orders/{id}` | Get order details by ID | None | `Order` object |
| `POST` | `/api/orders` | Submit new order & reduce stock | `Order` JSON | Created `Order` |
| `PATCH` | `/api/orders/{id}/status` | Update order delivery status | `{"status": "Shipped"}` | Updated `Order` |
| `DELETE` | `/api/orders/{id}` | Remove order record | None | `204 No Content` |

---

## 6. How to Run Module Tests

Ensure the Spring Boot backend is running, then execute in PowerShell:
```powershell
cd "Member_4_Order_Management/backend"
powershell -ExecutionPolicy Bypass -File "test-order-module.ps1"
```

---

## 7. Recommended Git Commit Plan

1. `feat(order): define Order root entity and OrderItem component entity (Composition)`
2. `feat(order-dao): implement OrderFileDAO adhering to GenericDAO with status update methods`
3. `feat(order-service): integrate OrderService with BookFileDAO for inventory decrement`
4. `feat(order-controller): build REST endpoints for /api/orders and status patch`
5. `feat(order-ui): create interactive cart.html with live subtotal and shipping calculations`
6. `feat(order-checkout): develop checkout.html and customer orders.html history views`
7. `feat(order-admin): build admin/orders.html with order inspection and status lifecycle modals`
8. `test(order): add test-order-module.ps1 automated verification suite`
