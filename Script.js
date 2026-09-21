// Reads `categories` and `menuItems` from menu-data.js

const menuGrid = document.getElementById("menuGrid");
const filterBar = document.getElementById("filterBar");
const searchInput = document.getElementById("menuSearch");
const noResults = document.getElementById("noResults");

let activeCategory = "all";
let searchText = "";

// Safely put text inside HTML (important once data comes from a database)
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getCategory(key) {
  return categories.find((c) => c.key === key);
}

// ---------- Filter buttons ----------
function renderFilters() {
  const all = [{ key: "all", label: "All" }, ...categories];

  filterBar.innerHTML = all
    .map(
      (c) => `
      <button type="button"
              class="filter-btn ${c.key === activeCategory ? "active" : ""}"
              data-category="${c.key}">
        ${escapeHTML(c.label)}
      </button>`
    )
    .join("");
}

// ---------- Menu cards ----------
function renderMenu() {
  const query = searchText.trim().toLowerCase();

  const filtered = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  menuGrid.innerHTML = filtered
    .map((item) => {
      const category = getCategory(item.category);
      const typeLabel = item.type === "veg" ? "Vegetarian" : "Non-vegetarian";

      return `
      <div class="col-12 col-md-6 col-lg-3">
        <div class="shadow menu-item-card p-3 mb-3">
          <img src="${category.image}" class="menu-item-image"
               alt="${escapeHTML(item.name)}" loading="lazy" />
          <h3 class="menu-card-title">${escapeHTML(item.name)}</h3>
          <p class="menu-item-category">${escapeHTML(category.label)}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="menu-item-price">&#8377;${item.price}</span>
            <span class="veg-badge ${item.type}" title="${typeLabel}" aria-label="${typeLabel}"></span>
          </div>
          <button type="button" class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
        </div>
      </div>`;
    })
    .join("");

  // Show a message when nothing matches
  noResults.classList.toggle("d-none", filtered.length > 0);
}

// ---------- Events ----------
filterBar.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-btn");
  if (!button) return;

  activeCategory = button.dataset.category;
  renderFilters();
  renderMenu();
});

searchInput.addEventListener("input", (event) => {
  searchText = event.target.value;
  renderMenu();
});

// ---------- First load ----------
renderFilters();
renderMenu();