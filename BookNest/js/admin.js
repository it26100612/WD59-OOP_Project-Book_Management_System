/**
 * BookNest — Online Bookstore Management System
 * SE1020 Object Oriented Programming Project
 * 
 * admin.js: Admin Dashboard and all 5 Admin CRUD Modules:
 * - Books CRUD (admin/books.html)
 * - Users CRUD (admin/users.html)
 * - Categories CRUD (admin/categories.html)
 * - Orders CRUD (admin/orders.html)
 * - Reviews CRUD (admin/reviews.html)
 * 
 * Clean, modular JavaScript functions that map 1:1 to future Java OOP
 * Controllers / Service methods (BookController, OrderController, etc.)
 */

document.addEventListener("DOMContentLoaded", () => {
  // Admin-only access guard.
  // The admin login page must set this session flag ONLY after valid admin login.
  if (sessionStorage.getItem("booknestAdminLoggedIn") !== "true") {
    window.location.replace("../login.html");
    return;
  }

  // Ensure any existing admin Logout / Sign Out control revokes the session.
  document.addEventListener("click", (event) => {
    const control = event.target.closest("a, button");
    if (control && /\\b(log ?out|sign ?out)\\b/i.test(control.textContent || "")) {
      event.preventDefault();
      adminSignOut();
    }
  });

  initAdminLayout();

  const path = window.location.pathname.toLowerCase();

  if (path.endsWith("dashboard.html")) {
    initAdminDashboard();
  } else if (path.endsWith("books.html")) {
    initAdminBooksCRUD();
  } else if (path.endsWith("users.html")) {
    initAdminUsersCRUD();
  } else if (path.endsWith("categories.html")) {
    initAdminCategoriesCRUD();
  } else if (path.endsWith("orders.html")) {
    initAdminOrdersCRUD();
  } else if (path.endsWith("reviews.html")) {
    initAdminReviewsCRUD();
  }
});

/* ==========================================================================
   Admin Global Layout & Sidebar
   ========================================================================== */
function initAdminLayout() {
  const toggleBtn = document.getElementById("admin-sidebar-toggle");
  const sidebar = document.querySelector(".admin-sidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("show");
    });
  }

  // Highlight current active link in sidebar
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll(".admin-nav-item");
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href && currentPath.endsWith(href.toLowerCase())) {
      link.classList.add("active");
    }
  });

  // Reset Demo Data Button (if present)
  /*window.handleResetDemoData = () => {
    if (confirm("Reset all BookNest data back to initial seed data? This will restore sample books, users, orders, and reviews.")) {
      BookNestStore.resetToDefault();
      UIUtils.showToast("Sample data restored to defaults!", "success");
      setTimeout(() => window.location.reload(), 1000);
    }
  };*/
}

/* ==========================================================================
   1. Admin Dashboard (admin/dashboard.html)
   ========================================================================== */
function initAdminDashboard() {
  const books = BookNestStore.getBooks();
  const users = BookNestStore.getUsers();
  const orders = BookNestStore.getOrders();
  const categories = BookNestStore.getCategories();

  // Metrics
  const totalBooksEl = document.getElementById("metric-total-books");
  const totalUsersEl = document.getElementById("metric-total-users");
  const totalOrdersEl = document.getElementById("metric-total-orders");
  const totalSalesEl = document.getElementById("metric-total-sales");

  if (totalBooksEl) totalBooksEl.textContent = books.length;
  if (totalUsersEl) totalUsersEl.textContent = users.length;
  if (totalOrdersEl) totalOrdersEl.textContent = orders.length;

  const totalSales = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0);
  if (totalSalesEl) totalSalesEl.textContent = UIUtils.formatPrice(totalSales);

  // Status breakdown counters
  const countPending = orders.filter(o => o.status === "Pending").length;
  const countProcessing = orders.filter(o => o.status === "Processing").length;
  const countShipped = orders.filter(o => o.status === "Shipped").length;
  const countDelivered = orders.filter(o => o.status === "Delivered").length;

  const countPendingEl = document.getElementById("status-count-pending");
  const countProcessingEl = document.getElementById("status-count-processing");
  const countShippedEl = document.getElementById("status-count-shipped");
  const countDeliveredEl = document.getElementById("status-count-delivered");

  if (countPendingEl) countPendingEl.textContent = countPending;
  if (countProcessingEl) countProcessingEl.textContent = countProcessing;
  if (countShippedEl) countShippedEl.textContent = countShipped;
  if (countDeliveredEl) countDeliveredEl.textContent = countDelivered;

  // Recent Orders Table
  const recentOrdersTbody = document.getElementById("dashboard-recent-orders");
  if (recentOrdersTbody) {
    const recentOrders = orders.slice(0, 5);
    recentOrdersTbody.innerHTML = recentOrders.map(order => `
      <tr>
        <td class="fw-bold">${order.id}</td>
        <td>${order.customerName}</td>
        <td><small class="text-muted">${order.date}</small></td>
        <td>${order.items.length} ${order.items.length === 1 ? 'item' : 'items'}</td>
        <td class="fw-bold text-primary">${UIUtils.formatPrice(order.total)}</td>
        <td>${UIUtils.getStatusBadge(order.status)}</td>
        <td class="text-end">
          <a href="orders.html?search=${order.id}" class="btn btn-sm btn-outline-custom">View</a>
        </td>
      </tr>
    `).join("");
  }

  // Recently Added Books Table
  const recentBooksTbody = document.getElementById("dashboard-recent-books");
  if (recentBooksTbody) {
    const recentBooks = books.slice(0, 5);
    recentBooksTbody.innerHTML = recentBooks.map(book => {
      const fallback = UIUtils.getFallbackCoverSvg(book.title, book.author);
      return `
        <tr>
          <td>
            <img src="${book.cover}" alt="${book.title}" class="table-thumb" onerror="this.onerror=null; this.src='${fallback}';">
          </td>
          <td>
            <div class="fw-bold">${book.title}</div>
            <small class="text-muted">by ${book.author}</small>
          </td>
          <td><span class="badge bg-light text-primary border">${book.category}</span></td>
          <td class="fw-semibold">${UIUtils.formatPrice(book.price)}</td>
          <td><span class="badge ${book.quantity > 5 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}">${book.quantity} in stock</span></td>
          <td class="text-end">
            <a href="books.html?search=${book.id}" class="btn btn-sm btn-outline-custom">Edit</a>
          </td>
        </tr>
      `;
    }).join("");
  }
}

/* ==========================================================================
   2. Book Management CRUD (admin/books.html)
   ========================================================================== */
function initAdminBooksCRUD() {
  const tableBody = document.getElementById("admin-books-table-body");
  const searchInput = document.getElementById("admin-books-search");
  const categoryFilter = document.getElementById("admin-books-category");
  const emptyState = document.getElementById("admin-books-empty");
  const countBadge = document.getElementById("admin-books-count");

  // Populate categories dropdown in filter and modals
  const categories = BookNestStore.getCategories();
  if (categoryFilter) {
    let options = '<option value="All">All Categories</option>';
    categories.forEach(c => {
      options += `<option value="${c.name}">${c.name}</option>`;
    });
    categoryFilter.innerHTML = options;
  }

  const addCategorySelect = document.getElementById("add-book-category");
  if (addCategorySelect) {
    addCategorySelect.innerHTML = categories.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
  }

  const editCategorySelect = document.getElementById("edit-book-category");
  if (editCategorySelect) {
    editCategorySelect.innerHTML = categories.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
  }

  function renderBooks() {
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const cat = categoryFilter ? categoryFilter.value : "All";

    let books = BookNestStore.getBooks();

    if (cat !== "All") {
      books = books.filter(b => b.category.toLowerCase() === cat.toLowerCase());
    }

    if (query) {
      books = books.filter(b => 
        b.id.toLowerCase().includes(query) ||
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        (b.isbn && b.isbn.toLowerCase().includes(query))
      );
    }

    if (countBadge) countBadge.textContent = `${books.length} Books`;

    if (books.length === 0) {
      if (tableBody) tableBody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    if (tableBody) {
      tableBody.innerHTML = books.map(book => {
        const fallback = UIUtils.getFallbackCoverSvg(book.title, book.author);
        const stockStatus = book.quantity <= 0 
          ? '<span class="badge bg-danger">Out of Stock</span>'
          : book.quantity < 5 
          ? `<span class="badge bg-warning text-dark">Low (${book.quantity})</span>`
          : `<span class="badge bg-success-subtle text-success">In Stock (${book.quantity})</span>`;

        return `
          <tr>
            <td class="fw-bold text-muted small">${book.id}</td>
            <td>
              <img src="${book.cover}" alt="${book.title}" class="table-thumb" onerror="this.onerror=null; this.src='${fallback}';">
            </td>
            <td>
              <div class="fw-bold text-dark">${book.title}</div>
              <small class="text-muted d-block">${book.isbn || 'No ISBN'}</small>
            </td>
            <td>${book.author}</td>
            <td><span class="badge bg-light text-primary border">${book.category}</span></td>
            <td class="fw-bold text-primary">${UIUtils.formatPrice(book.price)}</td>
            <td>${stockStatus}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-custom" onclick="viewBookModal('${book.id}')" title="View Details">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-custom" onclick="editBookModal('${book.id}')" title="Edit Book">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger" onclick="deleteBookAction('${book.id}')" title="Delete Book">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  if (searchInput) searchInput.addEventListener("input", renderBooks);
  if (categoryFilter) categoryFilter.addEventListener("change", renderBooks);

  // Add Book Form Handler
  const addBookForm = document.getElementById("addBookForm");
  if (addBookForm) {
    addBookForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("add-book-title").value.trim();
      const author = document.getElementById("add-book-author").value.trim();
      const category = document.getElementById("add-book-category").value;
      const isbn = document.getElementById("add-book-isbn").value.trim();
      const price = parseFloat(document.getElementById("add-book-price").value);
      const quantity = parseInt(document.getElementById("add-book-quantity").value);
      const cover = document.getElementById("add-book-cover").value.trim();
      const description = document.getElementById("add-book-description").value.trim();

      if (!title || !author || isNaN(price) || price < 0 || isNaN(quantity) || quantity < 0) {
        UIUtils.showToast("Please provide valid book details. Price and quantity must be positive.", "danger");
        return;
      }

      const newId = "BK-" + Math.floor(1000 + Math.random() * 9000);
      const newBook = {
        id: newId,
        title,
        author,
        category,
        isbn: isbn || "978-0000000000",
        price,
        quantity,
        cover: cover || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
        description: description || "No description provided.",
        rating: 5.0,
        reviewsCount: 1,
        featured: false,
        bestseller: false,
        newArrival: true,
        publisher: "University Press",
        publishedYear: new Date().getFullYear(),
        pages: 300,
        language: "English",
        format: "Paperback"
      };

      BookNestStore.saveBook(newBook);
      UIUtils.showToast(`Book "${title}" added successfully!`, "success");

      const modalEl = document.getElementById("addBookModal");
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      addBookForm.reset();
      renderBooks();
    });
  }

  // Edit Book Handler
  window.editBookModal = (id) => {
    const book = BookNestStore.getBookById(id);
    if (!book) return;

    document.getElementById("edit-book-id").value = book.id;
    document.getElementById("edit-book-title").value = book.title;
    document.getElementById("edit-book-author").value = book.author;
    document.getElementById("edit-book-category").value = book.category;
    document.getElementById("edit-book-isbn").value = book.isbn || "";
    document.getElementById("edit-book-price").value = book.price;
    document.getElementById("edit-book-quantity").value = book.quantity;
    document.getElementById("edit-book-cover").value = book.cover;
    document.getElementById("edit-book-description").value = book.description;

    const modalEl = document.getElementById("editBookModal");
    if (modalEl && window.bootstrap) {
      new bootstrap.Modal(modalEl).show();
    }
  };

  const editBookForm = document.getElementById("editBookForm");
  if (editBookForm) {
    editBookForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("edit-book-id").value;
      const title = document.getElementById("edit-book-title").value.trim();
      const author = document.getElementById("edit-book-author").value.trim();
      const category = document.getElementById("edit-book-category").value;
      const isbn = document.getElementById("edit-book-isbn").value.trim();
      const price = parseFloat(document.getElementById("edit-book-price").value);
      const quantity = parseInt(document.getElementById("edit-book-quantity").value);
      const cover = document.getElementById("edit-book-cover").value.trim();
      const description = document.getElementById("edit-book-description").value.trim();

      const updated = {
        id,
        title,
        author,
        category,
        isbn,
        price,
        quantity,
        cover,
        description
      };

      BookNestStore.saveBook(updated);
      UIUtils.showToast(`Book "${title}" updated successfully!`, "success");

      const modalEl = document.getElementById("editBookModal");
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      renderBooks();
    });
  }

  // View Book Handler
  window.viewBookModal = (id) => {
    const book = BookNestStore.getBookById(id);
    if (!book) return;

    const modalBody = document.getElementById("viewBookModalBody");
    const fallback = UIUtils.getFallbackCoverSvg(book.title, book.author);

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="row g-3">
          <div class="col-md-4 text-center">
            <img src="${book.cover}" alt="${book.title}" class="img-fluid rounded shadow-sm" style="max-height: 240px;" onerror="this.onerror=null; this.src='${fallback}';">
          </div>
          <div class="col-md-8">
            <h5 class="fw-bold text-dark mb-1">${book.title}</h5>
            <p class="text-muted mb-2">by ${book.author}</p>
            <div class="mb-2">
              <span class="badge bg-light text-primary border">${book.category}</span>
              <span class="badge bg-secondary ms-1">ISBN: ${book.isbn || 'N/A'}</span>
            </div>
            <div class="fs-5 fw-bold text-primary mb-2">${UIUtils.formatPrice(book.price)}</div>
            <p class="small text-muted mb-2"><strong>Quantity in Stock:</strong> ${book.quantity} copies</p>
            <p class="small text-secondary mb-0">${book.description}</p>
          </div>
        </div>
      `;

      const modalEl = document.getElementById("viewBookModal");
      if (modalEl && window.bootstrap) {
        new bootstrap.Modal(modalEl).show();
      }
    }
  };

  // Delete Book Handler
  window.deleteBookAction = (id) => {
    const book = BookNestStore.getBookById(id);
    if (!book) return;

    if (confirm(`Are you sure you want to delete "${book.title}" (ID: ${book.id})? This cannot be undone.`)) {
      BookNestStore.deleteBook(id);
      UIUtils.showToast(`Book "${book.title}" deleted successfully.`, "info");
      renderBooks();
    }
  };

  // Check URL query parameters (e.g. search from dashboard)
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("search");
  if (searchParam && searchInput) {
    searchInput.value = searchParam;
  }

  renderBooks();
}

/* ==========================================================================
   3. User Management CRUD (admin/users.html)
   ========================================================================== */
function initAdminUsersCRUD() {
  const tableBody = document.getElementById("admin-users-table-body");
  const searchInput = document.getElementById("admin-users-search");
  const roleFilter = document.getElementById("admin-users-role-filter");
  const emptyState = document.getElementById("admin-users-empty");
  const countBadge = document.getElementById("admin-users-count");

  function renderUsers() {
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const role = roleFilter ? roleFilter.value : "All";

    let users = BookNestStore.getUsers();

    if (role !== "All") {
      users = users.filter(u => u.role.toLowerCase() === role.toLowerCase());
    }

    if (query) {
      users = users.filter(u => 
        u.id.toLowerCase().includes(query) ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.phone && u.phone.includes(query))
      );
    }

    if (countBadge) countBadge.textContent = `${users.length} Users`;

    if (users.length === 0) {
      if (tableBody) tableBody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    if (tableBody) {
      tableBody.innerHTML = users.map(user => {
        const initial = user.name.charAt(0).toUpperCase();
        return `
          <tr>
            <td class="fw-bold text-muted small">${user.id}</td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold" style="width: 34px; height: 34px;">
                  ${initial}
                </div>
                <div>
                  <div class="fw-semibold text-dark">${user.name}</div>
                  <small class="text-muted">${user.address || 'Colombo, Sri Lanka'}</small>
                </div>
              </div>
            </td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${UIUtils.getStatusBadge(user.role)}</td>
            <td>${UIUtils.getStatusBadge(user.status || 'Active')}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-custom" onclick="viewUserModal('${user.id}')" title="View User">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-custom" onclick="editUserModal('${user.id}')" title="Edit User">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger" onclick="deleteUserAction('${user.id}')" title="Delete User">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  if (searchInput) searchInput.addEventListener("input", renderUsers);
  if (roleFilter) roleFilter.addEventListener("change", renderUsers);

  // Add User
  const addUserForm = document.getElementById("addUserForm");
  if (addUserForm) {
    addUserForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("add-user-name").value.trim();
      const email = document.getElementById("add-user-email").value.trim();
      const phone = document.getElementById("add-user-phone").value.trim();
      const role = document.getElementById("add-user-role").value;
      const status = document.getElementById("add-user-status").value;
      const address = document.getElementById("add-user-address").value.trim();

      if (!name || !email) {
        UIUtils.showToast("Please provide user name and email.", "danger");
        return;
      }

      const newId = "USR-" + Math.floor(1000 + Math.random() * 9000);
      const newUser = {
        id: newId,
        name,
        email,
        phone,
        role,
        status,
        address: address || "Colombo, Sri Lanka",
        registeredDate: new Date().toISOString().split("T")[0]
      };

      BookNestStore.saveUser(newUser);
      UIUtils.showToast(`User "${name}" added successfully!`, "success");

      const modalEl = document.getElementById("addUserModal");
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      addUserForm.reset();
      renderUsers();
    });
  }

  // Edit User
  window.editUserModal = (id) => {
    const user = BookNestStore.getUserById(id);
    if (!user) return;

    document.getElementById("edit-user-id").value = user.id;
    document.getElementById("edit-user-name").value = user.name;
    document.getElementById("edit-user-email").value = user.email;
    document.getElementById("edit-user-phone").value = user.phone || "";
    document.getElementById("edit-user-role").value = user.role;
    document.getElementById("edit-user-status").value = user.status || "Active";
    document.getElementById("edit-user-address").value = user.address || "";

    const modalEl = document.getElementById("editUserModal");
    if (modalEl && window.bootstrap) {
      new bootstrap.Modal(modalEl).show();
    }
  };

  const editUserForm = document.getElementById("editUserForm");
  if (editUserForm) {
    editUserForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("edit-user-id").value;
      const name = document.getElementById("edit-user-name").value.trim();
      const email = document.getElementById("edit-user-email").value.trim();
      const phone = document.getElementById("edit-user-phone").value.trim();
      const role = document.getElementById("edit-user-role").value;
      const status = document.getElementById("edit-user-status").value;
      const address = document.getElementById("edit-user-address").value.trim();

      const user = BookNestStore.getUserById(id);
      const updated = {
        ...user,
        name,
        email,
        phone,
        role,
        status,
        address
      };

      BookNestStore.saveUser(updated);
      UIUtils.showToast(`User details updated for "${name}".`, "success");

      const modalEl = document.getElementById("editUserModal");
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      renderUsers();
    });
  }

  // View User Modal
  window.viewUserModal = (id) => {
    const user = BookNestStore.getUserById(id);
    if (!user) return;

    const orders = BookNestStore.getOrders().filter(o => o.customerId === user.id || o.email === user.email);
    const modalBody = document.getElementById("viewUserModalBody");

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="text-center mb-3">
          <div class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-bold fs-3 mb-2" style="width: 70px; height: 70px;">
            ${user.name.charAt(0).toUpperCase()}
          </div>
          <h5 class="fw-bold mb-0">${user.name}</h5>
          <small class="text-muted">${user.email}</small>
          <div class="mt-2">
            ${UIUtils.getStatusBadge(user.role)}
            ${UIUtils.getStatusBadge(user.status || 'Active')}
          </div>
        </div>

        <div class="p-3 bg-light rounded mb-3">
          <div class="row g-2 small">
            <div class="col-6"><strong>User ID:</strong> ${user.id}</div>
            <div class="col-6"><strong>Phone:</strong> ${user.phone || 'N/A'}</div>
            <div class="col-6"><strong>Registered:</strong> ${user.registeredDate || '2026-01-01'}</div>
            <div class="col-6"><strong>Total Orders:</strong> ${orders.length}</div>
            <div class="col-12 mt-2"><strong>Address:</strong> ${user.address || 'N/A'}</div>
          </div>
        </div>
      `;

      const modalEl = document.getElementById("viewUserModal");
      if (modalEl && window.bootstrap) {
        new bootstrap.Modal(modalEl).show();
      }
    }
  };

  // Delete User Action
  window.deleteUserAction = (id) => {
    const user = BookNestStore.getUserById(id);
    if (!user) return;

    if (confirm(`Are you sure you want to delete user "${user.name}" (${user.email})?`)) {
      BookNestStore.deleteUser(id);
      UIUtils.showToast(`User "${user.name}" deleted.`, "info");
      renderUsers();
    }
  };

  renderUsers();
}

/* ==========================================================================
   4. Category Management CRUD (admin/categories.html)
   ========================================================================== */
function initAdminCategoriesCRUD() {
  const tableBody = document.getElementById("admin-categories-table-body");
  const searchInput = document.getElementById("admin-categories-search");
  const emptyState = document.getElementById("admin-categories-empty");
  const countBadge = document.getElementById("admin-categories-count");

  function renderCategories() {
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    let categories = BookNestStore.getCategories();
    const books = BookNestStore.getBooks();

    if (query) {
      categories = categories.filter(c => 
        c.id.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }

    if (countBadge) countBadge.textContent = `${categories.length} Categories`;

    if (categories.length === 0) {
      if (tableBody) tableBody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    if (tableBody) {
      tableBody.innerHTML = categories.map(cat => {
        const bookCount = books.filter(b => b.category.toLowerCase() === cat.name.toLowerCase()).length;
        return `
          <tr>
            <td class="fw-bold text-muted small">${cat.id}</td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <i class="bi ${cat.icon || 'bi-book'} fs-5 text-primary"></i>
                <span class="fw-bold text-dark">${cat.name}</span>
              </div>
            </td>
            <td><small class="text-muted">${cat.description}</small></td>
            <td><span class="badge bg-primary-subtle text-primary">${bookCount} Books</span></td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-custom" onclick="viewCategoryModal('${cat.id}')" title="View Category">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-custom" onclick="editCategoryModal('${cat.id}')" title="Edit Category">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger" onclick="deleteCategoryAction('${cat.id}')" title="Delete Category">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  if (searchInput) searchInput.addEventListener("input", renderCategories);

  // Add Category
  const addCategoryForm = document.getElementById("addCategoryForm");
  if (addCategoryForm) {
    addCategoryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("add-category-name").value.trim();
      const description = document.getElementById("add-category-desc").value.trim();
      const icon = document.getElementById("add-category-icon").value.trim();

      if (!name) {
        UIUtils.showToast("Category name is required.", "danger");
        return;
      }

      const newId = "CAT-" + Math.floor(100 + Math.random() * 900);
      const newCat = {
        id: newId,
        name,
        description: description || "Curated bookstore collection.",
        icon: icon || "bi-book"
      };

      BookNestStore.saveCategory(newCat);
      UIUtils.showToast(`Category "${name}" created successfully!`, "success");

      const modalEl = document.getElementById("addCategoryModal");
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      addCategoryForm.reset();
      renderCategories();
    });
  }

  // Edit Category
  window.editCategoryModal = (id) => {
    const cat = BookNestStore.getCategoryById(id);
    if (!cat) return;

    document.getElementById("edit-category-id").value = cat.id;
    document.getElementById("edit-category-name").value = cat.name;
    document.getElementById("edit-category-desc").value = cat.description;
    document.getElementById("edit-category-icon").value = cat.icon || "bi-book";

    const modalEl = document.getElementById("editCategoryModal");
    if (modalEl && window.bootstrap) {
      new bootstrap.Modal(modalEl).show();
    }
  };

  const editCategoryForm = document.getElementById("editCategoryForm");
  if (editCategoryForm) {
    editCategoryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("edit-category-id").value;
      const name = document.getElementById("edit-category-name").value.trim();
      const description = document.getElementById("edit-category-desc").value.trim();
      const icon = document.getElementById("edit-category-icon").value.trim();

      const updated = {
        id,
        name,
        description,
        icon: icon || "bi-book"
      };

      BookNestStore.saveCategory(updated);
      UIUtils.showToast(`Category "${name}" updated successfully!`, "success");

      const modalEl = document.getElementById("editCategoryModal");
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      renderCategories();
    });
  }

  // View Category Modal
  window.viewCategoryModal = (id) => {
    const cat = BookNestStore.getCategoryById(id);
    if (!cat) return;

    const books = BookNestStore.getBooks().filter(b => b.category.toLowerCase() === cat.name.toLowerCase());
    const modalBody = document.getElementById("viewCategoryModalBody");

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="d-flex align-items-center gap-3 mb-3">
          <div class="rounded p-3 bg-primary-subtle text-primary fs-3">
            <i class="bi ${cat.icon || 'bi-book'}"></i>
          </div>
          <div>
            <h5 class="fw-bold mb-1">${cat.name}</h5>
            <small class="text-muted">ID: ${cat.id}</small>
          </div>
        </div>
        <p class="text-secondary small mb-3">${cat.description}</p>

        <h6 class="fw-bold small text-uppercase text-muted mb-2">Books in this Category (${books.length})</h6>
        <div class="list-group list-group-flush border rounded">
          ${books.length === 0 ? '<div class="list-group-item text-muted small">No books in this category yet.</div>' : 
            books.map(b => `
              <div class="list-group-item d-flex justify-content-between align-items-center py-2">
                <span class="small fw-semibold">${b.title}</span>
                <span class="small text-muted">${UIUtils.formatPrice(b.price)}</span>
              </div>
            `).join("")}
        </div>
      `;

      const modalEl = document.getElementById("viewCategoryModal");
      if (modalEl && window.bootstrap) {
        new bootstrap.Modal(modalEl).show();
      }
    }
  };

  // Delete Category
  window.deleteCategoryAction = (id) => {
    const cat = BookNestStore.getCategoryById(id);
    if (!cat) return;

    const booksInCat = BookNestStore.getBooks().filter(b => b.category.toLowerCase() === cat.name.toLowerCase());
    if (booksInCat.length > 0) {
      if (!confirm(`Warning: There are ${booksInCat.length} books in the "${cat.name}" category. Are you sure you want to delete this category?`)) {
        return;
      }
    } else {
      if (!confirm(`Delete category "${cat.name}"?`)) return;
    }

    BookNestStore.deleteCategory(id);
    UIUtils.showToast(`Category "${cat.name}" deleted.`, "info");
    renderCategories();
  };

  renderCategories();
}

/* ==========================================================================
   5. Order Management CRUD (admin/orders.html)
   ========================================================================== */
function initAdminOrdersCRUD() {
  const tableBody = document.getElementById("admin-orders-table-body");
  const searchInput = document.getElementById("admin-orders-search");
  const statusFilter = document.getElementById("admin-orders-status-filter");
  const emptyState = document.getElementById("admin-orders-empty");
  const countBadge = document.getElementById("admin-orders-count");

  function renderOrders() {
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const status = statusFilter ? statusFilter.value : "All";

    let orders = BookNestStore.getOrders();

    if (status !== "All") {
      orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }

    if (query) {
      orders = orders.filter(o => 
        o.id.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.email.toLowerCase().includes(query) ||
        (o.phone && o.phone.includes(query))
      );
    }

    if (countBadge) countBadge.textContent = `${orders.length} Orders`;

    if (orders.length === 0) {
      if (tableBody) tableBody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    if (tableBody) {
      tableBody.innerHTML = orders.map(order => {
        return `
          <tr>
            <td class="fw-bold">${order.id}</td>
            <td>
              <div class="fw-semibold text-dark">${order.customerName}</div>
              <small class="text-muted">${order.phone}</small>
            </td>
            <td><small class="text-muted">${order.date}</small></td>
            <td><span class="badge bg-light text-dark border">${order.items.length} items</span></td>
            <td class="fw-bold text-primary">${UIUtils.formatPrice(order.total)}</td>
            <td>${UIUtils.getStatusBadge(order.status)}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-custom" onclick="viewOrderModal('${order.id}')" title="View Order">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-custom" onclick="updateOrderStatusModal('${order.id}')" title="Update Status">
                  <i class="bi bi-arrow-repeat"></i>
                </button>
                <button class="btn btn-outline-danger" onclick="deleteOrderAction('${order.id}')" title="Delete Order">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  if (searchInput) searchInput.addEventListener("input", renderOrders);
  if (statusFilter) statusFilter.addEventListener("change", renderOrders);

  // View Order Modal
  window.viewOrderModal = (id) => {
    const order = BookNestStore.getOrderById(id);
    if (!order) return;

    const modalBody = document.getElementById("viewOrderModalBody");
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <div>
            <h5 class="fw-bold mb-0">${order.id}</h5>
            <small class="text-muted">Placed on ${order.date}</small>
          </div>
          <div>${UIUtils.getStatusBadge(order.status)}</div>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <div class="p-3 bg-light rounded h-100">
              <h6 class="fw-bold small text-uppercase text-muted mb-2">Customer Details</h6>
              <p class="mb-1 small"><strong>Name:</strong> ${order.customerName}</p>
              <p class="mb-1 small"><strong>Email:</strong> ${order.email}</p>
              <p class="mb-0 small"><strong>Phone:</strong> ${order.phone}</p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="p-3 bg-light rounded h-100">
              <h6 class="fw-bold small text-uppercase text-muted mb-2">Delivery Information</h6>
              <p class="mb-1 small"><strong>Address:</strong> ${order.deliveryAddress}</p>
              <p class="mb-0 small"><strong>Order Notes:</strong> ${order.notes || "None"}</p>
            </div>
          </div>
        </div>

        <h6 class="fw-bold small text-uppercase text-muted mb-2">Ordered Items</h6>
        <div class="table-responsive border rounded mb-3">
          <table class="table table-sm mb-0">
            <thead class="table-light">
              <tr>
                <th>Book Title</th>
                <th class="text-center">Qty</th>
                <th class="text-end">Unit Price</th>
                <th class="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(i => `
                <tr>
                  <td>${i.title}</td>
                  <td class="text-center">${i.quantity}</td>
                  <td class="text-end">${UIUtils.formatPrice(i.price)}</td>
                  <td class="text-end fw-semibold">${UIUtils.formatPrice(i.price * i.quantity)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between small text-muted mb-1">
          <span>Subtotal:</span>
          <span>${UIUtils.formatPrice(order.subtotal)}</span>
        </div>
        <div class="d-flex justify-content-between small text-muted mb-2">
          <span>Shipping Fee:</span>
          <span>${order.shippingFee === 0 ? 'FREE' : UIUtils.formatPrice(order.shippingFee)}</span>
        </div>
        <div class="d-flex justify-content-between fw-bold fs-5 text-primary border-top pt-2">
          <span>Grand Total:</span>
          <span>${UIUtils.formatPrice(order.total)}</span>
        </div>
      `;

      const modalEl = document.getElementById("viewOrderModal");
      if (modalEl && window.bootstrap) {
        new bootstrap.Modal(modalEl).show();
      }
    }
  };

  // Update Status Modal
  window.updateOrderStatusModal = (id) => {
    const order = BookNestStore.getOrderById(id);
    if (!order) return;

    document.getElementById("status-order-id").value = order.id;
    document.getElementById("status-order-id-label").textContent = order.id;
    document.getElementById("status-select").value = order.status;

    const modalEl = document.getElementById("updateStatusModal");
    if (modalEl && window.bootstrap) {
      new bootstrap.Modal(modalEl).show();
    }
  };

  const statusForm = document.getElementById("updateStatusForm");
  if (statusForm) {
    statusForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("status-order-id").value;
      const newStatus = document.getElementById("status-select").value;

      BookNestStore.updateOrderStatus(id, newStatus);
      UIUtils.showToast(`Order ${id} status updated to "${newStatus}".`, "success");

      const modalEl = document.getElementById("updateStatusModal");
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      renderOrders();
    });
  }

  // Delete Order
  window.deleteOrderAction = (id) => {
    if (confirm(`Are you sure you want to delete order ${id}? This action cannot be reversed.`)) {
      BookNestStore.deleteOrder(id);
      UIUtils.showToast(`Order ${id} removed.`, "info");
      renderOrders();
    }
  };

  // Search parameter support
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("search");
  if (searchParam && searchInput) {
    searchInput.value = searchParam;
  }

  renderOrders();
}

/* ==========================================================================
   6. Review Management CRUD (admin/reviews.html)
   ========================================================================== */
function initAdminReviewsCRUD() {
  const tableBody = document.getElementById("admin-reviews-table-body");
  const searchInput = document.getElementById("admin-reviews-search");
  const ratingFilter = document.getElementById("admin-reviews-rating-filter");
  const emptyState = document.getElementById("admin-reviews-empty");
  const countBadge = document.getElementById("admin-reviews-count");

  function renderReviews() {
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const ratingVal = ratingFilter ? ratingFilter.value : "All";

    let reviews = BookNestStore.getReviews();

    if (ratingVal !== "All") {
      reviews = reviews.filter(r => r.rating === parseInt(ratingVal));
    }

    if (query) {
      reviews = reviews.filter(r => 
        r.id.toLowerCase().includes(query) ||
        r.customerName.toLowerCase().includes(query) ||
        r.bookTitle.toLowerCase().includes(query) ||
        r.comment.toLowerCase().includes(query)
      );
    }

    if (countBadge) countBadge.textContent = `${reviews.length} Reviews`;

    if (reviews.length === 0) {
      if (tableBody) tableBody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    if (tableBody) {
      tableBody.innerHTML = reviews.map(rev => {
        return `
          <tr>
            <td class="fw-bold text-muted small">${rev.id}</td>
            <td class="fw-semibold text-dark">${rev.customerName}</td>
            <td>
              <div class="fw-medium text-primary">${rev.bookTitle}</div>
            </td>
            <td>
              <div class="d-flex align-items-center gap-1">
                ${UIUtils.renderStars(rev.rating)}
                <span class="small fw-bold ms-1">(${rev.rating})</span>
              </div>
            </td>
            <td>
              <p class="small text-secondary mb-0" style="max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${rev.comment}">
                ${rev.comment}
              </p>
            </td>
            <td><small class="text-muted">${rev.date}</small></td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-custom" onclick="viewReviewModal('${rev.id}')" title="View Review">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-custom" onclick="editReviewModal('${rev.id}')" title="Edit Review">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger" onclick="deleteReviewAction('${rev.id}')" title="Delete Review">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  if (searchInput) searchInput.addEventListener("input", renderReviews);
  if (ratingFilter) ratingFilter.addEventListener("change", renderReviews);

  // View Review Modal
  window.viewReviewModal = (id) => {
    const rev = BookNestStore.getReviews().find(r => r.id === id);
    if (!rev) return;

    const modalBody = document.getElementById("viewReviewModalBody");
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <h5 class="fw-bold mb-0 text-dark">${rev.customerName}</h5>
            <div>${UIUtils.renderStars(rev.rating)}</div>
          </div>
          <small class="text-muted">Reviewed on ${rev.date} &bull; ID: ${rev.id}</small>
        </div>

        <div class="p-3 bg-light rounded mb-3">
          <h6 class="fw-bold small text-uppercase text-muted mb-1">Book</h6>
          <div class="fw-bold text-primary">${rev.bookTitle}</div>
        </div>

        <h6 class="fw-bold small text-uppercase text-muted mb-1">Customer Comment</h6>
        <p class="text-secondary small bg-white border p-3 rounded">${rev.comment}</p>
      `;

      const modalEl = document.getElementById("viewReviewModal");
      if (modalEl && window.bootstrap) {
        new bootstrap.Modal(modalEl).show();
      }
    }
  };

  // Edit Review Modal
  window.editReviewModal = (id) => {
    const rev = BookNestStore.getReviews().find(r => r.id === id);
    if (!rev) return;

    document.getElementById("edit-review-id").value = rev.id;
    document.getElementById("edit-review-customer").value = rev.customerName;
    document.getElementById("edit-review-rating").value = rev.rating;
    document.getElementById("edit-review-comment").value = rev.comment;

    const modalEl = document.getElementById("editReviewModal");
    if (modalEl && window.bootstrap) {
      new bootstrap.Modal(modalEl).show();
    }
  };

  const editReviewForm = document.getElementById("editReviewForm");
  if (editReviewForm) {
    editReviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("edit-review-id").value;
      const customer = document.getElementById("edit-review-customer").value.trim();
      const rating = parseInt(document.getElementById("edit-review-rating").value);
      const comment = document.getElementById("edit-review-comment").value.trim();

      if (isNaN(rating) || rating < 1 || rating > 5) {
        UIUtils.showToast("Rating must be an integer between 1 and 5.", "danger");
        return;
      }

      const rev = BookNestStore.getReviews().find(r => r.id === id);
      const updated = {
        ...rev,
        customerName: customer,
        rating,
        comment
      };

      BookNestStore.saveReview(updated);
      UIUtils.showToast("Review updated successfully!", "success");

      const modalEl = document.getElementById("editReviewModal");
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      renderReviews();
    });
  }

  // Delete Review
  window.deleteReviewAction = (id) => {
    if (confirm(`Are you sure you want to delete review ${id}?`)) {
      BookNestStore.deleteReview(id);
      UIUtils.showToast("Review deleted successfully.", "info");
      renderReviews();
    }
  };

  renderReviews();
}


/* ==========================================================================
   Admin Session
   ========================================================================== */

// Connect your admin Sign Out button to onclick="adminSignOut()".
function adminSignOut() {
  sessionStorage.removeItem("booknestAdminLoggedIn");
  sessionStorage.removeItem("userRole");
  window.location.replace("../login.html");
}
