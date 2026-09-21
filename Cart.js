// Cart logic. Needs `menuItems` from menu-data.js.

const CART_KEY = "foodMunchCart";
const CODE_KEY = "foodMunchDiscountCode";

// Valid discount codes and their percentage off (Phase 7 will move this to the backend)
const DISCOUNT_CODES = {
  MUNCH10: 10,
  FIRST20: 20
};

// ---------- Storage helpers (localStorage can fail, so always use try/catch) ----------
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Storage full or blocked: the cart still works, it just won't be remembered
  }
}

function loadCart() {
  try {
    const saved = JSON.parse(readStorage(CART_KEY));
    if (!Array.isArray(saved)) return [];
    // Keep only items that still exist in the menu, with a valid quantity
    return saved.filter(
      (entry) =>
        menuItems.some((item) => item.id === entry.id) &&
        Number.isInteger(entry.qty) &&
        entry.qty > 0
    );
  } catch (error) {
    return [];
  }
}

function loadCode() {
  const saved = readStorage(CODE_KEY);
  return saved && DISCOUNT_CODES[saved] ? saved : "";
}

// ---------- State ----------
let cart = loadCart();      // [{ id: 3, qty: 2 }, ...]
let appliedCode = loadCode(); // "" or "MUNCH10"

function saveState() {
  writeStorage(CART_KEY, JSON.stringify(cart));
  writeStorage(CODE_KEY, appliedCode);
}

// ---------- DOM elements ----------
const cartCountEl = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const cartSummaryEl = document.getElementById("cartSummary");
const subtotalEl = document.getElementById("cartSubtotal");
const discountRowEl = document.getElementById("discountRow");
const discountAmountEl = document.getElementById("cartDiscount");
const totalEl = document.getElementById("cartTotal");
const discountInput = document.getElementById("discountInput");
const discountMessage = document.getElementById("discountMessage");
const applyDiscountBtn = document.getElementById("applyDiscountBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const orderMessage = document.getElementById("orderMessage");

// ---------- Helpers ----------
function findItem(id) {
  return menuItems.find((item) => item.id === id);
}

function money(amount) {
  return "\u20B9" + Math.round(amount);
}

function calculateTotals() {
  const subtotal = cart.reduce((sum, entry) => sum + findItem(entry.id).price * entry.qty, 0);
  const percent = appliedCode ? DISCOUNT_CODES[appliedCode] : 0;
  const discount = (subtotal * percent) / 100;
  return { subtotal, percent, discount, total: subtotal - discount };
}

// ---------- Cart actions ----------
function addToCart(id) {
  const existing = cart.find((entry) => entry.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  orderMessage.classList.add("d-none");
  saveState();
  renderCart();
}

function changeQty(id, change) {
  const entry = cart.find((e) => e.id === id);
  if (!entry) return;
  entry.qty += change;
  if (entry.qty <= 0) {
    cart = cart.filter((e) => e.id !== id);
  }
  saveState();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((entry) => entry.id !== id);
  saveState();
  renderCart();
}

function clearCart() {
  cart = [];
  appliedCode = "";
  discountInput.value = "";
  discountMessage.textContent = "";
  saveState();
  renderCart();
}

// ---------- Rendering ----------
function renderCart() {
  const totalQty = cart.reduce((sum, entry) => sum + entry.qty, 0);
  cartCountEl.textContent = totalQty;
  cartCountEl.classList.toggle("d-none", totalQty === 0);

  const isEmpty = cart.length === 0;
  cartEmptyEl.classList.toggle("d-none", !isEmpty);
  cartSummaryEl.classList.toggle("d-none", isEmpty);
  clearCartBtn.disabled = isEmpty;
  checkoutBtn.disabled = isEmpty;

  cartItemsEl.innerHTML = cart
    .map((entry) => {
      const item = findItem(entry.id);
      const name = escapeHTML(item.name); // escapeHTML comes from script.js
      return `
      <div class="cart-item d-flex align-items-center">
        <div class="cart-item-info">
          <p class="cart-item-name">${name}</p>
          <p class="cart-item-price">${money(item.price)} each</p>
        </div>
        <div class="cart-qty d-flex align-items-center">
          <button type="button" class="qty-btn" data-action="decrease" data-id="${item.id}"
                  aria-label="Decrease quantity of ${name}">&minus;</button>
          <span class="qty-value">${entry.qty}</span>
          <button type="button" class="qty-btn" data-action="increase" data-id="${item.id}"
                  aria-label="Increase quantity of ${name}">+</button>
        </div>
        <div class="cart-line-total">${money(item.price * entry.qty)}</div>
        <button type="button" class="cart-remove-btn" data-action="remove" data-id="${item.id}"
                aria-label="Remove ${name}">&times;</button>
      </div>`;
    })
    .join("");

  const { subtotal, percent, discount, total } = calculateTotals();
  subtotalEl.textContent = money(subtotal);
  totalEl.textContent = money(total);
  discountRowEl.classList.toggle("d-none", percent === 0);
  discountAmountEl.textContent = "-" + money(discount) + " (" + percent + "%)";

  if (appliedCode) {
    discountInput.value = appliedCode;
  }
}

// ---------- Events ----------

// "Add to Cart" buttons on the menu cards (cards are created by script.js, so listen on the grid)
document.getElementById("menuGrid").addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-cart-btn");
  if (!button) return;

  addToCart(Number(button.dataset.id));

  // Small confirmation on the button itself
  button.textContent = "Added \u2713";
  button.classList.add("added");
  setTimeout(() => {
    button.textContent = "Add to Cart";
    button.classList.remove("added");
  }, 900);
});

// Plus, minus and remove buttons inside the cart
cartItemsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") changeQty(id, 1);
  if (action === "decrease") changeQty(id, -1);
  if (action === "remove") removeItem(id);
});

// Discount code
function applyDiscount() {
  const code = discountInput.value.trim().toUpperCase();

  if (!code) {
    discountMessage.textContent = "Enter a discount code.";
    discountMessage.className = "discount-message error";
    return;
  }

  if (DISCOUNT_CODES[code]) {
    appliedCode = code;
    saveState();
    renderCart();
    discountMessage.textContent = "Code " + code + " applied: " + DISCOUNT_CODES[code] + "% off.";
    discountMessage.className = "discount-message success";
  } else {
    appliedCode = "";
    saveState();
    renderCart();
    discountMessage.textContent = "That code is not valid.";
    discountMessage.className = "discount-message error";
  }
}

applyDiscountBtn.addEventListener("click", applyDiscount);
discountInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") applyDiscount();
});

clearCartBtn.addEventListener("click", clearCart);

// Demo checkout: real orders are saved in the database in a later phase
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  const { total } = calculateTotals();
  clearCart();
  orderMessage.textContent =
    "Order placed (demo)! Total paid: " + money(total) + ". Real orders will be saved once the backend is ready.";
  orderMessage.classList.remove("d-none");
});

// ---------- First load ----------
renderCart();