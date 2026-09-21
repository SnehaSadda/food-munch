

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
 
 
// ---------- Buttons that scroll to a section (View Menu, Order Now) ----------
document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});
 
// ---------- Watch Video modal ----------
// Put your YouTube video ID here. Example: for https://www.youtube.com/watch?v=abc123XYZ the ID is abc123XYZ
const VIDEO_ID = "1dVTMgf8lQlWsuit";
 
const videoWrapper = document.getElementById("videoWrapper");
 
// Bootstrap 4 modal events come through jQuery (jQuery is loaded before this file)
$("#videoModal").on("show.bs.modal", () => {
  if (VIDEO_ID === "YOUR_VIDEO_ID") {
    videoWrapper.innerHTML =
      '<p class="text-center m-4">Add your YouTube video ID to <code>VIDEO_ID</code> in script.js to play a video here.</p>';
    return;
  }
  videoWrapper.innerHTML =
    '<div class="embed-responsive embed-responsive-16by9">' +
    '<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + VIDEO_ID +
    '?autoplay=1" title="Food Munch video" allow="autoplay; encrypted-media" allowfullscreen></iframe>' +
    "</div>";
});
 
// Remove the video when the modal closes so it stops playing
$("#videoModal").on("hidden.bs.modal", () => {
  videoWrapper.innerHTML = "";
});
 
