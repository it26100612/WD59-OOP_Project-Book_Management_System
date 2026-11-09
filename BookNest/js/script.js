/**
 * BookNest — Online Bookstore Management System
 * SE1020 Object Oriented Programming Project
 * 
 * script.js: Customer-facing interactive UI behaviors, rendering logic,
 * cart operations, filter/search controls, and client-side form validations.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Always initialize cart badge and authentication pill across all customer pages
  initCustomerNav();

  // Detect current page and invoke specific page initializer
  const path = window.location.pathname.toLowerCase();

  if (path.endsWith("index.html") || path.endsWith("/") || path.endsWith("/booknest/")) {
    initHomePage();
  } else if (path.endsWith("books.html")) {
    initBrowseBooksPage();
  } else if (path.endsWith("book-details.html")) {
    initBookDetailsPage();
  } else if (path.endsWith("cart.html")) {
    initCartPage();
  } else if (path.endsWith("checkout.html")) {
    initCheckoutPage();
  } else if (path.endsWith("orders.html")) {
    initOrdersPage();
  } else if (path.endsWith("profile.html")) {
    initProfilePage();
  } else if (path.endsWith("login.html")) {
    initLoginPage();
  } else if (path.endsWith("register.html")) {
    initRegisterPage();
  }
});

/* ==========================================================================
   Global Customer Navbar & State
   ========================================================================== */
function initCustomerNav() {
  updateCartBadge();
  window.addEventListener("booknest:cartUpdated", () => {
    updateCartBadge();
  });

  const authContainer = document.getElementById("nav-auth-container");
  const footerAuthLinks = document.getElementById("footer-auth-links");

  if (footerAuthLinks) {
    const currentUser = BookNestStore.getCurrentUser();
    footerAuthLinks.style.display = currentUser ? "none" : "inline-flex";
  }
  if (authContainer) {
    const user = BookNestStore.getCurrentUser();
    if (user) {
      authContainer.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-outline-custom btn-sm-custom dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle fs-6 text-primary"></i>
            <span class="d-none d-sm-inline fw-semibold">${user.name.split(" ")[0]}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 py-2">
            <li class="px-3 py-2 border-bottom">
              <div class="fw-bold text-dark">${user.name}</div>
              <small class="text-muted">${user.email}</small>
              <div><span class="badge bg-primary-subtle text-primary mt-1">${user.role}</span></div>
            </li>
            <li><a class="dropdown-item py-2" href="profile.html"><i class="bi bi-person me-2 text-primary"></i>My Profile</a></li>
            <li><a class="dropdown-item py-2" href="orders.html"><i class="bi bi-box-seam me-2 text-primary"></i>My Orders</a></li>
            ${user.role === 'Admin' ? '<li><a class="dropdown-item py-2 text-warning-emphasis" href="admin/dashboard.html"><i class="bi bi-speedometer2 me-2"></i>Admin Dashboard</a></li>' : ''}
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item py-2 text-danger" href="javascript:void(0)" onclick="handleLogout()"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
          </ul>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <a href="login.html" class="btn btn-outline-custom btn-sm-custom">Login</a>
          <a href="register.html" class="btn btn-primary-custom btn-sm-custom">Register</a>
        </div>
      `;
    }
  }
}

function updateCartBadge() {
  const badgeEl = document.getElementById("nav-cart-count");
  if (badgeEl) {
    const count = BookNestStore.getCartCount();
    badgeEl.textContent = count;
    badgeEl.style.display = count > 0 ? "inline-block" : "none";
  }
}

function handleLogout() {
  sessionStorage.removeItem("booknestAdminLoggedIn");
  BookNestStore.logout();
  UIUtils.showToast("You have been logged out successfully.", "info");
  setTimeout(() => {
    window.location.href = "login.html";
}, 800);
}

/* ==========================================================================
   Home Page Logic (index.html)
   ========================================================================== */
function initHomePage() {
  // Search Form redirect
  const heroSearchForm = document.getElementById("hero-search-form");
  const heroSearchInput = document.getElementById("hero-search-input");
  if (heroSearchForm && heroSearchInput) {
    heroSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = heroSearchInput.value.trim();
      if (query) {
        window.location.href = `books.html?search=${encodeURIComponent(query)}`;
      } else {
        window.location.href = `books.html`;
      }
    });
  }

  // Render Popular Categories
  const categoriesGrid = document.getElementById("home-categories-grid");
  if (categoriesGrid) {
    const categories = BookNestStore.getCategories();
    const books = BookNestStore.getBooks();

    categoriesGrid.innerHTML = categories.map(cat => {
      const count = books.filter(b => b.category === cat.name).length;
      return `
        <div class="col-6 col-md-4 col-lg-2">
          <a href="books.html?category=${encodeURIComponent(cat.name)}" class="category-card">
            <div class="category-icon-wrapper">
              <i class="bi ${cat.icon || 'bi-book'}"></i>
            </div>
            <div class="category-name">${cat.name}</div>
            <p class="category-count">${count} Books</p>
          </a>
        </div>
      `;
    }).join("");
  }

  
  // Render Featured Books
  const featuredGrid = document.getElementById("home-featured-grid");

  if (featuredGrid) {
    const books = BookNestStore.getBooks();
    const featured = books.filter(b => b.featured);

    featuredGrid.innerHTML = (
      featured.length ? featured : books
    ).slice(0, 4).map(book => createBookCardHtml(book)).join("");
  }

  // Render Best Sellers
  const bestsellersGrid = document.getElementById("home-bestsellers-grid");

  if (bestsellersGrid) {
    const books = BookNestStore.getBooks();
    const bestsellers = books.filter(b => b.bestseller);

    bestsellersGrid.innerHTML = (
      bestsellers.length ? bestsellers : books
    ).slice(0, 4).map(book => createBookCardHtml(book)).join("");
  }


  // Render New Arrivals
  const newArrivalsGrid = document.getElementById("home-newarrivals-grid");
  if (newArrivalsGrid) {
    const books = BookNestStore.getBooks();
    const arrivals = books
    .filter(b => b.newArrival === true)
    .slice(0, 4);
    newArrivalsGrid.innerHTML = arrivals.map(book => createBookCardHtml(book)).join("");
  }

  
  // Render Weekly Spotlight from saved books
  const spotlightTitle = document.getElementById("spotlight-title");

  if (spotlightTitle) {
    const books = BookNestStore.getBooks();

    // Choose a featured book; otherwise use the first available book
    const spotlightBook =
      books.find(book => book.featured === true) || books[0];

    if (spotlightBook) {
      document.getElementById("spotlight-title").textContent =
        spotlightBook.title;

      document.getElementById("spotlight-author").textContent =
        spotlightBook.author;

      document.getElementById("spotlight-cover").src =
        spotlightBook.cover;

      document.getElementById("spotlight-cover").alt =
        spotlightBook.title;

      document.getElementById("spotlight-price").textContent =
        UIUtils.formatPrice(spotlightBook.price);

      document.getElementById("spotlight-rating").innerHTML =
        `${UIUtils.renderStars(spotlightBook.rating || 5)}
         ${(spotlightBook.rating || 5).toFixed(1)}
         (${spotlightBook.reviewsCount || 10})`;

      document.getElementById("spotlight-link").href =
        `book-details.html?id=${encodeURIComponent(spotlightBook.id)}`;
    }
  }


}

/* ==========================================================================
   Reusable Book Card Generator
   ========================================================================== */
function createBookCardHtml(book) {
  const stockBadge = book.quantity <= 0 
    ? '<span class="book-badge-tag bg-danger">Out of Stock</span>'
    : book.quantity < 5 
    ? '<span class="book-badge-tag bg-warning text-dark">Low Stock</span>'
    : '';

  const bestsellerBadge = book.bestseller 
    ? '<span class="book-badge-tag bg-success">Bestseller</span>' 
    : '';

  const fallback = UIUtils.getFallbackCoverSvg(book.title, book.author);

  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="book-card">
        <div class="book-cover-container">
          <div class="book-badge-ribbon">
            ${bestsellerBadge}
            ${stockBadge}
          </div>
          <a href="book-details.html?id=${book.id}" class="w-100 h-100 d-block">
            <img src="${book.cover}" alt="${book.title}" class="book-cover-img" onerror="this.onerror=null; this.src='${fallback}';">
          </a>
        </div>
        <div class="book-card-body">
          <span class="book-card-category">${book.category}</span>
          <h5 class="book-card-title">
            <a href="book-details.html?id=${book.id}" title="${book.title}">${book.title}</a>
          </h5>
          <p class="book-card-author">by ${book.author}</p>
          <div class="book-rating-box">
            <div>${UIUtils.renderStars(book.rating || 5)}</div>
            <span class="book-rating-score">${(book.rating || 5).toFixed(1)}</span>
            <span class="book-rating-count">(${book.reviewsCount || 10})</span>
          </div>
          <div class="book-card-footer">
            <div class="book-price-tag">${UIUtils.formatPrice(book.price)}</div>
            <div class="book-actions-group">
              <a href="book-details.html?id=${book.id}" class="btn btn-outline-custom btn-sm-custom" title="View Details">
                <i class="bi bi-eye"></i>
              </a>
              <button class="btn btn-primary-custom btn-sm-custom" onclick="handleAddToCart('${book.id}', 1)" ${book.quantity <= 0 ? 'disabled' : ''} title="Add to Cart">
                <i class="bi bi-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function handleAddToCart(bookId, qty = 1) {
  const result = BookNestStore.addToCart(bookId, qty);
  if (result.success) {
    UIUtils.showToast(result.message, "success");
  } else {
    UIUtils.showToast(result.message, "danger");
  }
}


/* ==========================================================================
   Browse Books Page (books.html)
   ========================================================================== */
function initBrowseBooksPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get("search") || "";
  const initialCategory = urlParams.get("category") || "All";

  const searchInput = document.getElementById("books-search-input");
  const categoryFilter = document.getElementById("books-category-filter");
  const sortSelect = document.getElementById("books-sort-select");
  const stockFilter = document.getElementById("books-stock-filter");
  const minPriceInput = document.getElementById("books-min-price");
  const maxPriceInput = document.getElementById("books-max-price");
  const applyBtn = document.getElementById("books-apply-filters");
  const clearBtn = document.getElementById("books-clear-filters");
  const gridContainer = document.getElementById("browse-books-grid");
  const countLabel = document.getElementById("books-count-label");
  const emptyState = document.getElementById("books-empty-state");

  // Populate category dropdown
  if (categoryFilter) {
    const categories = BookNestStore.getCategories();
    let optionsHtml = '<option value="All">All Categories</option>';

    categories.forEach(cat => {
      const selected =
        cat.name.toLowerCase() === initialCategory.toLowerCase()
          ? "selected"
          : "";

      optionsHtml += `<option value="${cat.name}" ${selected}>${cat.name}</option>`;
    });

    categoryFilter.innerHTML = optionsHtml;
  }

  if (searchInput) {
    searchInput.value = initialSearch;
  }

  // Store the price range selected by the user
  let appliedMinPrice = null;
  let appliedMaxPrice = null;

  function filterAndRender() {
    const query = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    const category = categoryFilter
      ? categoryFilter.value
      : "All";

    const sort = sortSelect
      ? sortSelect.value
      : "featured";

    const inStockOnly = stockFilter
      ? stockFilter.checked
      : false;

    let books = BookNestStore.getBooks();

    // 1. Search by title, author, or ISBN
    if (query) {
      books = books.filter(book =>
        (book.title || "").toLowerCase().includes(query) ||
        (book.author || "").toLowerCase().includes(query) ||
        (book.isbn || "").toLowerCase().includes(query)
      );
    }

    // 2. Filter by category
    if (category !== "All") {
      books = books.filter(book =>
        (book.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    // 3. Filter by minimum price
    if (appliedMinPrice !== null) {
      books = books.filter(book =>
        Number(book.price) >= appliedMinPrice
      );
    }

    // 4. Filter by maximum price
    if (appliedMaxPrice !== null) {
      books = books.filter(book =>
        Number(book.price) <= appliedMaxPrice
      );
    }

    // 5. Filter by stock availability
    if (inStockOnly) {
      books = books.filter(book => Number(book.quantity) > 0);
    }

    // 6. Sort books
    if (sort === "price-low") {
      books.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-high") {
      books.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "title-az") {
      books.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "title-za") {
      books.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sort === "rating") {
      books.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // 7. Update result count
    if (countLabel) {
      countLabel.textContent =
        `Showing ${books.length} ${books.length === 1 ? "book" : "books"}`;
    }

    // 8. Render book cards
    if (books.length === 0) {
      if (gridContainer) gridContainer.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
    } else {
      if (emptyState) emptyState.style.display = "none";

      if (gridContainer) {
        gridContainer.innerHTML = books
          .map(book => createBookCardHtml(book))
          .join("");
      }
    }
  }

  // Validate and apply price range
  function applyPriceFilters() {
    const minValue = minPriceInput ? minPriceInput.value.trim() : "";
    const maxValue = maxPriceInput ? maxPriceInput.value.trim() : "";

    const min = minValue === "" ? null : Number(minValue);
    const max = maxValue === "" ? null : Number(maxValue);

    if (
      (min !== null && (!Number.isFinite(min) || min < 0)) ||
      (max !== null && (!Number.isFinite(max) || max < 0))
    ) {
      alert("Please enter valid positive prices.");
      return;
    }

    if (min !== null && max !== null && min > max) {
      alert("Minimum price cannot be greater than maximum price.");
      return;
    }

    appliedMinPrice = min;
    appliedMaxPrice = max;
    filterAndRender();
  }

  // Search updates results while typing
  if (searchInput) {
    searchInput.addEventListener("input", filterAndRender);
  }

  // Other filters update results immediately
  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterAndRender);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", filterAndRender);
  }

  if (stockFilter) {
    stockFilter.addEventListener("change", filterAndRender);
  }

  // Apply selected price range
  if (applyBtn) {
    applyBtn.addEventListener("click", applyPriceFilters);
  }

  // Also apply price range when pressing Enter
  [minPriceInput, maxPriceInput].forEach(input => {
    if (input) {
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          applyPriceFilters();
        }
      });
    }
  });

  // Reset all filters
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (categoryFilter) categoryFilter.value = "All";
      if (sortSelect) sortSelect.value = "featured";
      if (stockFilter) stockFilter.checked = false;
      if (minPriceInput) minPriceInput.value = "";
      if (maxPriceInput) maxPriceInput.value = "";

      appliedMinPrice = null;
      appliedMaxPrice = null;

      filterAndRender();
    });
  }

  // Initial render
  filterAndRender();
}

/* ==========================================================================
   Book Details Page (book-details.html)
   ========================================================================== */
function initBookDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  let bookId = urlParams.get("id");
  let book = BookNestStore.getBookById(bookId);

  // Fallback to first book if not found
  if (!book) {
    const allBooks = BookNestStore.getBooks();
    book = allBooks[0];
  }

  if (!book) return;

  // Title, Meta, & Breadcrumb
  document.title = `${book.title} — BookNest`;
  const breadcrumbEl = document.getElementById("book-breadcrumb-title");
  if (breadcrumbEl) breadcrumbEl.textContent = book.title;

  // Cover image
  const coverEl = document.getElementById("book-details-cover");
  if (coverEl) {
    coverEl.src = book.cover;
    coverEl.alt = book.title;
    coverEl.onerror = () => {
      coverEl.src = UIUtils.getFallbackCoverSvg(book.title, book.author);
    };
  }

  // Basic Details
  const titleEl = document.getElementById("book-details-title");
  if (titleEl) titleEl.textContent = book.title;

  const authorEl = document.getElementById("book-details-author");
  if (authorEl) authorEl.textContent = book.author;

  const categoryEl = document.getElementById("book-details-category");
  if (categoryEl) {
    categoryEl.textContent = book.category;
    categoryEl.href = `books.html?category=${encodeURIComponent(book.category)}`;
  }

  const priceEl = document.getElementById("book-details-price");
  if (priceEl) priceEl.textContent = UIUtils.formatPrice(book.price);

  const descEl = document.getElementById("book-details-description");
  if (descEl) descEl.textContent = book.description;

  const stockBadgeEl = document.getElementById("book-details-stock-badge");
  if (stockBadgeEl) {
    if (book.quantity <= 0) {
      stockBadgeEl.className = "badge bg-danger px-3 py-2";
      stockBadgeEl.textContent = "Out of Stock";
    } else if (book.quantity < 5) {
      stockBadgeEl.className = "badge bg-warning text-dark px-3 py-2";
      stockBadgeEl.textContent = `Low Stock (${book.quantity} copies left)`;
    } else {
      stockBadgeEl.className = "badge bg-success-subtle text-success px-3 py-2";
      stockBadgeEl.textContent = `In Stock (${book.quantity} copies available)`;
    }
  }

  const ratingStarsEl = document.getElementById("book-details-rating-stars");
  if (ratingStarsEl) {
    ratingStarsEl.innerHTML = `${UIUtils.renderStars(book.rating || 5)} <span class="ms-2 fw-bold">${(book.rating || 5).toFixed(1)} / 5</span> <span class="text-muted">(${book.reviewsCount || 10} ratings)</span>`;
  }

  // Specifications
  const isbnEl = document.getElementById("spec-isbn");
  if (isbnEl) isbnEl.textContent = book.isbn || "N/A";

  const publisherEl = document.getElementById("spec-publisher");
  if (publisherEl) publisherEl.textContent = book.publisher || "BookNest Academic Editions";

  const yearEl = document.getElementById("spec-year");
  if (yearEl) yearEl.textContent = book.publishedYear || "2023";

  const pagesEl = document.getElementById("spec-pages");
  if (pagesEl) pagesEl.textContent = book.pages ? `${book.pages} pages` : "340 pages";

  const langEl = document.getElementById("spec-language");
  if (langEl) langEl.textContent = book.language || "English";

  const formatEl = document.getElementById("spec-format");
  if (formatEl) formatEl.textContent = book.format || "Paperback";

  // Quantity controls
  const qtyInput = document.getElementById("details-quantity-input");
  const qtyMinus = document.getElementById("details-qty-minus");
  const qtyPlus = document.getElementById("details-qty-plus");

  if (qtyMinus && qtyInput) {
    qtyMinus.addEventListener("click", () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
  }

  if (qtyPlus && qtyInput) {
    qtyPlus.addEventListener("click", () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val < book.quantity) qtyInput.value = val + 1;
    });
  }

  // Add to Cart Button
  const addToCartBtn = document.getElementById("details-add-to-cart-btn");
  if (addToCartBtn) {
    if (book.quantity <= 0) {
      addToCartBtn.disabled = true;
      addToCartBtn.innerHTML = `<i class="bi bi-x-circle me-2"></i>Out of Stock`;
    } else {
      addToCartBtn.addEventListener("click", () => {
        const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
        handleAddToCart(book.id, qty);
      });
    }
  }

  // Render Reviews for this Book
  renderBookReviews(book);

  // Review Submission Form
  const reviewForm = document.getElementById("add-review-form");
  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const reviewerName = document.getElementById("review-name").value.trim();
      const rating = parseInt(document.getElementById("review-rating").value);
      const comment = document.getElementById("review-comment").value.trim();

      if (!reviewerName || !rating || !comment) {
        UIUtils.showToast("Please fill in all review fields.", "danger");
        return;
      }

      const newReview = {
        id: "REV-" + Date.now().toString().slice(-5),
        bookId: book.id,
        bookTitle: book.title,
        customerName: reviewerName,
        rating: rating,
        comment: comment,
        date: new Date().toISOString().split("T")[0]
      };

      BookNestStore.saveReview(newReview);
      UIUtils.showToast("Thank you! Your review has been added.", "success");
      reviewForm.reset();
      renderBookReviews(book);
    });
  }

  // Related Books
  const relatedGrid = document.getElementById("related-books-grid");
  if (relatedGrid) {
    const allBooks = BookNestStore.getBooks();
    const related = allBooks.filter(b => b.category === book.category && b.id !== book.id).slice(0, 4);
    if (related.length > 0) {
      relatedGrid.innerHTML = related.map(b => createBookCardHtml(b)).join("");
    } else {
      const fallbackRelated = allBooks.filter(b => b.id !== book.id).slice(0, 4);
      relatedGrid.innerHTML = fallbackRelated.map(b => createBookCardHtml(b)).join("");
    }
  }
}

function renderBookReviews(book) {
  const reviewsContainer = document.getElementById("book-reviews-list");
  if (!reviewsContainer) return;

  const reviews = BookNestStore.getReviewsByBookId(book.id);

  if (reviews.length === 0) {
    reviewsContainer.innerHTML = `
      <div class="p-4 text-center text-muted bg-white border rounded">
        <i class="bi bi-chat-square-text fs-3 mb-2 d-block text-secondary"></i>
        No customer reviews yet. Be the first to review this book!
      </div>
    `;
    return;
  }

  reviewsContainer.innerHTML = reviews.map(rev => `
    <div class="card border-0 bg-white shadow-sm mb-3">
      <div class="card-body p-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <strong class="text-dark">${rev.customerName}</strong>
            <small class="text-muted ms-2">${rev.date}</small>
          </div>
          <div>${UIUtils.renderStars(rev.rating)}</div>
        </div>
        <p class="text-secondary mb-0 small">${rev.comment}</p>
      </div>
    </div>
  `).join("");
}

/* ==========================================================================
   Shopping Cart Page (cart.html)
   ========================================================================== */
function initCartPage() {
  const cartTableBody = document.getElementById("cart-items-body");
  const subtotalEl = document.getElementById("cart-subtotal");
  const shippingEl = document.getElementById("cart-shipping");
  const totalEl = document.getElementById("cart-total");
  const emptyState = document.getElementById("cart-empty-state");
  const contentWrapper = document.getElementById("cart-content-wrapper");
  const clearCartBtn = document.getElementById("cart-clear-btn");

  function renderCart() {
    const cart = BookNestStore.getCart();

    if (cart.length === 0) {
      if (contentWrapper) contentWrapper.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (contentWrapper) contentWrapper.style.display = "block";
    if (emptyState) emptyState.style.display = "none";

    if (cartTableBody) {
      cartTableBody.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        const fallback = UIUtils.getFallbackCoverSvg(item.title, item.author);

        return `
          <div class="cart-item-row" id="cart-row-${item.bookId}">
            <img src="${item.cover}" alt="${item.title}" class="cart-thumb" onerror="this.onerror=null; this.src='${fallback}';">
            <div class="flex-grow-1">
              <span class="badge bg-light text-primary border mb-1">${item.category || 'Book'}</span>
              <h6 class="mb-1 fw-bold">
                <a href="book-details.html?id=${item.bookId}" class="text-dark">${item.title}</a>
              </h6>
              <div class="text-muted small mb-2">Price: ${UIUtils.formatPrice(item.price)} each</div>
              
              <div class="d-flex align-items-center gap-3">
                <div class="quantity-control-group">
                  <button class="qty-btn" onclick="updateCartRow('${item.bookId}', ${item.quantity - 1})" aria-label="Decrease quantity">
                    <i class="bi bi-dash"></i>
                  </button>
                  <input type="text" class="qty-input" value="${item.quantity}" readonly>
                  <button class="qty-btn" onclick="updateCartRow('${item.bookId}', ${item.quantity + 1})" aria-label="Increase quantity">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeCartRow('${item.bookId}')" title="Remove item">
                  <i class="bi bi-trash"></i> Remove
                </button>
              </div>
            </div>
            <div class="text-end">
              <div class="fw-bold text-primary fs-5">${UIUtils.formatPrice(itemTotal)}</div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Calculations
    const subtotal = BookNestStore.getCartSubtotal();
    const shipping = subtotal > 10000 ? 0 : 350;
    const total = subtotal + (subtotal > 0 ? shipping : 0);

    if (subtotalEl) subtotalEl.textContent = UIUtils.formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? "FREE" : UIUtils.formatPrice(shipping);
    if (totalEl) totalEl.textContent = UIUtils.formatPrice(total);
  }

  // Row update and remove functions exposed on window
  window.updateCartRow = (bookId, newQty) => {
    BookNestStore.updateCartQuantity(bookId, newQty);
    renderCart();
  };

  window.removeCartRow = (bookId) => {
    BookNestStore.removeFromCart(bookId);
    UIUtils.showToast("Item removed from cart.", "info");
    renderCart();
  };

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your shopping cart?")) {
        BookNestStore.clearCart();
        UIUtils.showToast("Cart has been cleared.", "info");
        renderCart();
      }
    });
  }

  renderCart();
}

/* ==========================================================================
   Checkout Page (checkout.html)
   ========================================================================== */
function initCheckoutPage() {
  const cart = BookNestStore.getCart();

  // If cart is empty, redirect back to the cart page.
  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  // Customers must be logged in before checkout. Guest browsing and cart remain available.
  const currentUser = BookNestStore.getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // Pre-fill user data for the logged-in customer.
  if (currentUser) {
    const nameInput = document.getElementById("checkout-name");
    const emailInput = document.getElementById("checkout-email");
    const phoneInput = document.getElementById("checkout-phone");
    const addressInput = document.getElementById("checkout-address");

    if (nameInput && currentUser.name) nameInput.value = currentUser.name;
    if (emailInput && currentUser.email) emailInput.value = currentUser.email;
    if (phoneInput && currentUser.phone) phoneInput.value = currentUser.phone;
    if (addressInput && currentUser.address) addressInput.value = currentUser.address;
  }

  // Render items summary
  const summaryContainer = document.getElementById("checkout-items-summary");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const shippingEl = document.getElementById("checkout-shipping");
  const totalEl = document.getElementById("checkout-total");

  if (summaryContainer) {
    summaryContainer.innerHTML = cart.map(item => `
      <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
        <div>
          <span class="fw-semibold text-dark">${item.title}</span>
          <small class="text-muted d-block">Qty: ${item.quantity} × ${UIUtils.formatPrice(item.price)}</small>
        </div>
        <span class="fw-bold text-dark">${UIUtils.formatPrice(item.price * item.quantity)}</span>
      </div>
    `).join("");
  }

  const subtotal = BookNestStore.getCartSubtotal();
  const shipping = subtotal > 10000 ? 0 : 350;
  const total = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = UIUtils.formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? "FREE" : UIUtils.formatPrice(shipping);
  if (totalEl) totalEl.textContent = UIUtils.formatPrice(total);

  // Form submit handler
  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("checkout-name").value.trim();
      const email = document.getElementById("checkout-email").value.trim();
      const phone = document.getElementById("checkout-phone").value.trim();
      const address = document.getElementById("checkout-address").value.trim();
      const city = document.getElementById("checkout-city").value.trim();
      const notes = document.getElementById("checkout-notes") ? document.getElementById("checkout-notes").value.trim() : "";

      if (!name || !email || !phone || !address || !city) {
        UIUtils.showToast("Please fill in all required delivery details.", "danger");
        return;
      }

      // Generate realistic Order Object
      const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
      const newOrder = {
        id: orderId,
        customerId: currentUser ? currentUser.id : "GUEST-" + Date.now().toString().slice(-4),
        customerName: name,
        email: email,
        phone: phone,
        date: new Date().toISOString().split("T")[0],
        deliveryAddress: `${address}, ${city}`,
        notes: notes || "Standard doorstep delivery requested.",
        items: cart.map(i => ({
          bookId: i.bookId,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          cover: i.cover
        })),
        subtotal: subtotal,
        shippingFee: shipping,
        total: total,
        status: "Pending"
      };

      // Save order to store and clear cart
      BookNestStore.saveOrder(newOrder);
      BookNestStore.clearCart();

      // Show confirmation modal
      const modalOrderId = document.getElementById("confirm-order-id");
      const modalTotal = document.getElementById("confirm-order-total");
      const modalAddress = document.getElementById("confirm-order-address");

      if (modalOrderId) modalOrderId.textContent = orderId;
      if (modalTotal) modalTotal.textContent = UIUtils.formatPrice(total);
      if (modalAddress) modalAddress.textContent = `${address}, ${city}`;

      const modalEl = document.getElementById("orderSuccessModal");
      if (modalEl && window.bootstrap) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      } else {
        alert(`Order placed successfully!\nOrder ID: ${orderId}\nTotal: ${UIUtils.formatPrice(total)}`);
        window.location.href = "orders.html";
      }
    });
  }
}

/* ==========================================================================
   Customer Orders Page (orders.html)
   ========================================================================== */
function initOrdersPage() {
  // Order history is available only to logged-in customers or the admin.
  const currentUser = BookNestStore.getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const ordersContainer = document.getElementById("orders-list-container");
  const emptyState = document.getElementById("orders-empty-state");

  function renderOrders() {
    const allOrders = BookNestStore.getOrders();
    const currentUser = BookNestStore.getCurrentUser();

    // In a multi-user app, filter by customer email or ID, or show all customer orders for demo
    
    let customerOrders = [];
    
    if (currentUser) {
    if (currentUser.role === "Admin") {
        customerOrders = allOrders;
      
      } else {
        customerOrders = allOrders.filter(order =>
          (
            order.customerId != null &&
                currentUser.id != null &&
                String(order.customerId) === String(currentUser.id)
              ) ||
              
              (
                order.email &&
                currentUser.email &&
                order.email.toLowerCase() ===
                currentUser.email.toLowerCase()
              )
            );
          }
        }


    if (customerOrders.length === 0) {
      if (ordersContainer) ordersContainer.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    if (ordersContainer) {
      ordersContainer.innerHTML = customerOrders.map(order => {
        const canCancel = order.status === "Pending" || order.status === "Processing";

        const itemsThumbnails = order.items.map(item => `
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="badge bg-secondary-subtle text-dark">${item.quantity}x</span>
            <span class="fw-semibold text-dark">${item.title}</span>
            <span class="text-muted ms-auto">${UIUtils.formatPrice(item.price * item.quantity)}</span>
          </div>
        `).join("");

        return `
          <div class="order-card" id="order-card-${order.id}">
            <div class="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-3 gap-2">
              <div>
                <span class="fw-bold fs-5 text-dark me-2">${order.id}</span>
                <span class="text-muted small">Placed on ${order.date}</span>
              </div>
              <div>
                ${UIUtils.getStatusBadge(order.status)}
              </div>
            </div>

            <div class="row">
              <div class="col-lg-8 border-end-lg mb-3 mb-lg-0">
                <h6 class="text-muted small text-uppercase fw-bold mb-2">Ordered Items</h6>
                ${itemsThumbnails}
                <div class="mt-3 text-muted small">
                  <i class="bi bi-geo-alt me-1 text-primary"></i> <strong>Delivery Address:</strong> ${order.deliveryAddress}
                </div>
              </div>
              <div class="col-lg-4 d-flex flex-column justify-content-between">
                <div>
                  <h6 class="text-muted small text-uppercase fw-bold mb-2">Order Summary</h6>
                  <div class="d-flex justify-content-between text-muted small mb-1">
                    <span>Subtotal:</span>
                    <span>${UIUtils.formatPrice(order.subtotal)}</span>
                  </div>
                  <div class="d-flex justify-content-between text-muted small mb-2">
                    <span>Shipping:</span>
                    <span>${order.shippingFee === 0 ? "FREE" : UIUtils.formatPrice(order.shippingFee)}</span>
                  </div>
                  <div class="d-flex justify-content-between fw-bold fs-5 text-primary border-top pt-2">
                    <span>Total:</span>
                    <span>${UIUtils.formatPrice(order.total)}</span>
                  </div>
                </div>

                <div class="d-flex gap-2 mt-3">
                  <button class="btn btn-outline-custom btn-sm-custom flex-grow-1" onclick="viewOrderDetailsModal('${order.id}')">
                    <i class="bi bi-info-circle me-1"></i> View Details
                  </button>
                  ${canCancel ? `
                    <button class="btn btn-outline-danger btn-sm-custom" onclick="cancelCustomerOrder('${order.id}')">
                      Cancel Order
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  window.cancelCustomerOrder = (orderId) => {
    if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
      BookNestStore.updateOrderStatus(orderId, "Cancelled");
      UIUtils.showToast(`Order ${orderId} has been cancelled.`, "info");
      renderOrders();
    }
  };

  window.viewOrderDetailsModal = (orderId) => {
    const order = BookNestStore.getOrderById(orderId);
    if (!order) return;

    const modalBody = document.getElementById("orderDetailsModalBody");
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="fw-bold mb-0">${order.id}</h5>
            ${UIUtils.getStatusBadge(order.status)}
          </div>
          <small class="text-muted">Ordered on ${order.date} by ${order.customerName}</small>
        </div>

        <div class="p-3 bg-light rounded mb-3">
          <h6 class="fw-bold mb-2 small text-uppercase text-muted">Delivery Information</h6>
          <p class="mb-1 small"><strong>Address:</strong> ${order.deliveryAddress}</p>
          <p class="mb-1 small"><strong>Phone:</strong> ${order.phone}</p>
          <p class="mb-0 small"><strong>Notes:</strong> ${order.notes || "None"}</p>
        </div>

        <h6 class="fw-bold mb-2 small text-uppercase text-muted">Item Breakdown</h6>
        <div class="table-responsive border rounded mb-3">
          <table class="table table-sm mb-0">
            <thead class="table-light">
              <tr>
                <th>Item</th>
                <th class="text-center">Qty</th>
                <th class="text-end">Price</th>
                <th class="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.title}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-end">${UIUtils.formatPrice(item.price)}</td>
                  <td class="text-end fw-semibold">${UIUtils.formatPrice(item.price * item.quantity)}</td>
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
          <span>Delivery Fee:</span>
          <span>${order.shippingFee === 0 ? 'FREE' : UIUtils.formatPrice(order.shippingFee)}</span>
        </div>
        <div class="d-flex justify-content-between fw-bold fs-5 text-primary border-top pt-2">
          <span>Grand Total:</span>
          <span>${UIUtils.formatPrice(order.total)}</span>
        </div>
      `;

      const modalEl = document.getElementById("orderDetailsModal");
      if (modalEl && window.bootstrap) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    }
  };

  renderOrders();
}

/* ==========================================================================
   User Profile Page (profile.html)
   ========================================================================== */
function initProfilePage() {
  const currentUser = BookNestStore.getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // Populate Profile Card
  const avatarEl = document.getElementById("profile-avatar-initial");
  if (avatarEl) avatarEl.textContent = currentUser.name.charAt(0).toUpperCase();

  const nameHeader = document.getElementById("profile-header-name");
  if (nameHeader) nameHeader.textContent = currentUser.name;

  const emailHeader = document.getElementById("profile-header-email");
  if (emailHeader) emailHeader.textContent = currentUser.email;

  const roleBadge = document.getElementById("profile-header-role");
  if (roleBadge) roleBadge.textContent = currentUser.role;

  // Form Fields
  const nameInput = document.getElementById("profile-name");
  const emailInput = document.getElementById("profile-email");
  const phoneInput = document.getElementById("profile-phone");
  const addressInput = document.getElementById("profile-address");

  if (nameInput) nameInput.value = currentUser.name;
  if (emailInput) emailInput.value = currentUser.email;
  if (phoneInput) phoneInput.value = currentUser.phone || "";
  if (addressInput) addressInput.value = currentUser.address || "";

  // Metrics
  const orders = BookNestStore.getOrders().filter(o => o.customerId === currentUser.id || o.email === currentUser.email);
  const totalOrdersEl = document.getElementById("profile-stat-orders");
  if (totalOrdersEl) totalOrdersEl.textContent = orders.length;

  const totalSpent = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0);
  const totalSpentEl = document.getElementById("profile-stat-spent");
  if (totalSpentEl) totalSpentEl.textContent = UIUtils.formatPrice(totalSpent);

  // Form submission
  const form = document.getElementById("profile-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const updatedUser = {
        ...currentUser,
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim()
      };

      BookNestStore.saveUser(updatedUser);
      BookNestStore.setCurrentUser(updatedUser);
      UIUtils.showToast("Profile details updated successfully!", "success");
      setTimeout(() => window.location.reload(), 1000);
    });
  }
}

/* ==========================================================================
   Login Page (login.html)
   ========================================================================== */
function initLoginPage() {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passInput = document.getElementById("login-password");
  const togglePassBtn = document.getElementById("toggle-login-password");

  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener("click", () => {
      const isPass = passInput.type === "password";
      passInput.type = isPass ? "text" : "password";
      togglePassBtn.innerHTML = isPass
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';
    });
  }

  // Demo login autofill helpers
  window.fillCustomerDemo = () => {
    if (emailInput) emailInput.value = "amaya@gmail.com";
    if (passInput) passInput.value = "password123";
  };

  window.fillAdminDemo = () => {
    if (emailInput) emailInput.value = "admin@booknest.lk";
    if (passInput) passInput.value = "admin123";
  };

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const pass = passInput.value;

    if (!email || !pass) {
      UIUtils.showToast("Please enter both email and password.", "danger");
      return;
    }

    const users = BookNestStore.getUsers();
    const user = users.find(
      (u) => (u.email || "").trim().toLowerCase() === email
    );

    // Keep the existing admin demo login unchanged.
    if (email === "admin@booknest.lk") {
      if (pass === "admin123") {
        const adminUser = {
          ...(user || {}),
          id: user?.id || "USR-1001",
          name: user?.name || "Admin",
          email: "admin@booknest.lk",
          role: "Admin"
        };

        BookNestStore.setCurrentUser(adminUser);
        sessionStorage.setItem("booknestAdminLoggedIn", "true");
        UIUtils.showToast("Welcome back, Admin!", "success");

        setTimeout(() => {
          window.location.href = "admin/dashboard.html";
        }, 800);
      } else {
        sessionStorage.removeItem("booknestAdminLoggedIn");
        UIUtils.showToast("Invalid admin email or password.", "danger");
      }
      return;
    }

    // Customers must register before they can log in.
    sessionStorage.removeItem("booknestAdminLoggedIn");

    if (!user) {
      UIUtils.showToast("Account not found. Please register first.", "danger");
      return;
    }

    if (user.role === "Admin") {
      UIUtils.showToast(
        "Please use the admin login form for the admin account.",
        "danger"
      );
      return;
    }

    // Accounts created before this fix may not have a saved password.
    if (!user.password) {
      UIUtils.showToast(
        "This account has no saved password. Please register again with this email.",
        "warning"
      );
      return;
    }

    if (user.password !== pass) {
      UIUtils.showToast("Invalid email or password.", "danger");
      return;
    }

    BookNestStore.setCurrentUser(user);
    UIUtils.showToast(`Welcome back, ${user.name}!`, "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  });
}

/* ==========================================================================
   Register Page (register.html)
   ========================================================================== */
function initRegisterPage() {
  const form = document.getElementById("register-form");
  const nameInput = document.getElementById("register-name");
  const emailInput = document.getElementById("register-email");
  const phoneInput = document.getElementById("register-phone");
  const passInput = document.getElementById("register-password");
  const confirmPassInput = document.getElementById("register-confirm-password");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const pass = passInput.value;
    const confirmPass = confirmPassInput.value;

    if (!name || !email || !phone || !pass || !confirmPass) {
      UIUtils.showToast("Please fill in all registration fields.", "danger");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      UIUtils.showToast("Please enter a valid email address.", "danger");
      return;
    }

    if (email.toLowerCase() === "admin@booknest.lk") {
      UIUtils.showToast(
        "This email is reserved for the administrator.",
        "danger"
      );
      return;
    }

    if (pass !== confirmPass) {
      UIUtils.showToast("Passwords do not match. Please verify.", "danger");
      return;
    }

    if (pass.length < 6) {
      UIUtils.showToast(
        "Password must be at least 6 characters long.",
        "danger"
      );
      return;
    }

    const users = BookNestStore.getUsers();
    const normalizedEmail = email.toLowerCase();

    const existingUser = users.find(
      (u) => (u.email || "").trim().toLowerCase() === normalizedEmail
    );

    if (existingUser && existingUser.password) {
      UIUtils.showToast(
        "An account with this email already exists. Please login.",
        "warning"
      );
      return;
    }

    // Repair old demo accounts that were created without storing a password.
    // New registrations and repaired accounts both store the chosen password.
    const newUser = {
      ...(existingUser || {}),
      id: existingUser?.id || ("USR-" + Date.now().toString().slice(-4)),
      name,
      email: email.trim(),
      phone,
      password: pass,
      role: "Customer",
      status: existingUser?.status || "Active",
      address: existingUser?.address || "Sri Lanka",
      registeredDate: existingUser?.registeredDate || new Date().toISOString().split("T")[0]
    };

    BookNestStore.saveUser(newUser);
    BookNestStore.setCurrentUser(newUser);

    UIUtils.showToast(
      existingUser
        ? "Account updated with a password! Redirecting to home..."
        : "Account created successfully! Redirecting to home...",
      "success"
    );

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  });
}
