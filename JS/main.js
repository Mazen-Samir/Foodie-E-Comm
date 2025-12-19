// =========================================== Hamada ===========================================

const initialMenuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 8.5,
    category: "Pizza",
    img: "./images/Gemini_Generated_Image_margherita.png",
    desc: "Classic tomato, mozzarella, basil.",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    price: 9.5,
    category: "Pizza",
    img: "./images/Gemini_Generated_Image_peppironi_pizza.png",
    desc: "Pepperoni, cheese, tomato sauce.",
  },
  {
    id: 3,
    name: "Caesar Salad",
    price: 6.0,
    category: "Salads",
    img: "./images/Gemini_Generated_Image_caeser_salad.png",
    desc: "Romaine, croutons, parmesan, Caesar dressing.",
  },
  {
    id: 4,
    name: "Grilled Chicken",
    price: 11.0,
    category: "Mains",
    img: "./images/Grilled_image.jfif",
    desc: "Herb-marinated grilled chicken with sides.",
  },
  {
    id: 5,
    name: "Beef Burger",
    price: 7.5,
    category: "Burgers",
    img: "./images/Beef_burger.jfif",
    desc: "Juicy beef patty, cheddar, pickles.",
  },
  {
    id: 6,
    name: "Vegan Wrap",
    price: 6.5,
    category: "Vegan",
    img: "./images/vegan_wrap.jfif",
    desc: "Roasted veggies, hummus, spinach.",
  },
  {
    id: 7,
    name: "Grilled Chicken",
    price: 11.0,
    category: "Mains",
    img: "./images/Grilled_image.jfif",
    desc: "Herb-marinated grilled chicken with sides.",
  },
  {
    id: 8,
    name: "Pepperoni Pizza",
    price: 9.5,
    category: "Pizza",
    img: "./images/Gemini_Generated_Image_peppironi_pizza.png",
    desc: "Pepperoni, cheese, tomato sauce.",
  },
];

// ---------- App state (persist in localStorage) ----------
let dishes = JSON.parse(localStorage.getItem("dishes")) || initialMenuItems;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let currentUser = localStorage.getItem("currentUser") || null;

// admin simple credential (demo)
const adminCred = { user: "admin", pass: "admin123" };

// populate categories
function populateCategories() {
  const cat = ["all", ...new Set(dishes.map((d) => d.category))];
  const sel = document.getElementById("category");
  sel.innerHTML = "";
  cat.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
}

// render menu
function renderMenu() {
  const q = (
    (document.getElementById("search") &&
      document.getElementById("search").value) ||
    ""
  ).toLowerCase();
  const category =
    (document.getElementById("category") &&
      document.getElementById("category").value) ||
    "all";
  const container = document.getElementById("menuList");
  container.innerHTML = "";
  dishes
    .filter(
      (d) =>
        (category === "all" || d.category === category) &&
        (d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q))
    )
    .forEach((d) => {
      const el = document.createElement("div");
      el.className = "dish";
      el.innerHTML = `
        <img src="${d.img}" alt="${d.name}">
        <h4>${d.name}</h4>
        <p class="small">${d.category} • ${d.desc}</p>
        <div class="meta">
          <strong>$${d.price.toFixed(2)}</strong>
          <div style="display:flex;gap:6px">
            <button class='btn secondary' onclick='viewDish(${
              d.id
            })'>Details</button>
            <button class='btn' onclick='addToCart(${d.id})'>Add</button>
          </div>
        </div>`;
      container.appendChild(el);
    });

  if (container.innerHTML === "") {
    container.innerHTML = '<div class="large">No dishes found.</div>';
  }
  renderCartSidebar();
}

function viewDish(id) {
  const d = dishes.find((x) => x.id === id);
  if (!d) return alert("Dish not found");
  const box = document.getElementById("dishModalContent");
  box.innerHTML = `
    <h2>${d.name}</h2>
    <img src='${
      d.img
    }' style='width:100%;height:220px;object-fit:cover;border-radius:8px;margin:8px 0'>
    <p>${d.desc}</p>
    <p><b>Category:</b> ${d.category}</p>
    <p><b>Price:</b> $${d.price.toFixed(2)}</p>
    <div style='display:flex;gap:8px;margin-top:10px'>
      <button class='btn' onclick='addToCart(${
        d.id
      });closeModal("dishModal")'>Add to cart</button>
      <button class='btn secondary' onclick='closeModal("dishModal")'>Close</button>
    </div>`;
  openModal("dishModal");
}

// cart operations
function addToCart(id) {
  const item = cart.find((c) => c.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  renderCartSidebar();
  updateCartCount();
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  saveCart();
  renderCartSidebar();
  updateCartCount();
}

function changeQty(id, delta) {
  const it = cart.find((c) => c.id === id);
  if (!it) return;
  it.qty += delta;
  if (it.qty < 1) removeFromCart(id);
  saveCart();
  renderCartSidebar();
  updateCartCount();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCartSidebar();
  updateCartCount();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCartSidebar() {
  const el = document.getElementById("cartList");
  el.innerHTML = "";
  if (cart.length === 0) {
    el.innerHTML = '<div class="small">Cart is empty</div>';
    return;
  }
  cart.forEach((c) => {
    const d = dishes.find((x) => x.id === c.id);
    if (!d) return;
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
    <div><strong>${d.name}</strong><div class='small'>${d.category}</div></div>
    <div style='text-align:right'>
      <div>$${(d.price * c.qty).toFixed(2)}</div>
      <div style='margin-top:6px'>
        <button class='btn secondary' onclick='changeQty(${c.id},-1)'>-</button>
        <span style='padding:0 8px'>${c.qty}</span>
        <button class='btn secondary' onclick='changeQty(${c.id},1)'>+</button>
        <button class='btn' style='margin-left:6px' onclick='removeFromCart(${
          c.id
        })'>Remove</button>
      </div>
    </div>`;
    el.appendChild(row);
  });
}

function updateCartCount() {
  document.getElementById("cartCount").innerText = cart.reduce(
    (a, b) => a + b.qty,
    0
  );
}

// ---------- Order placement (simulated payment) ----------
function openCart() {
  const modal = document.getElementById("cartModalContent");
  if (cart.length === 0) {
    modal.innerHTML = `<h3>Your Cart</h3><div class="small">Cart is empty</div><div style="margin-top:12px"><button class="btn" onclick="closeModal('cartModal')">Close</button></div>`;
    openModal("cartModal");
    return;
  }

  let total = 0;
  const lines = cart
    .map((c) => {
      const d = dishes.find((x) => x.id === c.id);
      total += d.price * c.qty;
      return `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed #eee">
      <div><b>${d.name}</b><div class='small'>${c.qty} × $${d.price.toFixed(
        2
      )}</div></div>
      <div><b>$${(d.price * c.qty).toFixed(2)}</b></div>
    </div>`;
    })
    .join("");

  modal.innerHTML = `
    <h3>Checkout</h3>
    ${lines}
    <div style='margin-top:12px;display:flex;justify-content:space-between'>
      <div class='small'>Subtotal</div>
      <div><b>$${total.toFixed(2)}</b></div>
    </div>
    <div style='margin-top:14px;display:flex;gap:8px'>
      <button class='btn' onclick='openCheckout()'>Proceed to Checkout</button>
      <button class='btn secondary' onclick="closeModal('cartModal')">Close</button>
    </div>`;
  openModal("cartModal");
}

function placeOrder() {
  // legacy helper - kept for backward compatibility but now opens checkout
  openCheckout();
}

// ---------- Orders & cancellation (within 5 minutes) ----------
function openOrders() {
  const el = document.getElementById("ordersModalContent");
  const userOrders = currentUser
    ? orders.filter((o) => o.user === currentUser)
    : [];
  el.innerHTML =
    `<h3>Your Orders</h3>` +
    (currentUser
      ? userOrders.length
        ? userOrders.map((o) => renderOrderRow(o)).join("")
        : '<div class="small">No orders yet.</div>'
      : '<div class="small">Please login to see orders.</div>') +
    `<div style="margin-top:12px"><button class='btn' onclick="closeModal('ordersModal')">Close</button></div>`;
  window.location.href = "orders.html";
}

function renderOrderRow(o) {
  const rows = o.items
    .map((i) => {
      const d = dishes.find((x) => x.id === i.id);
      return `
        <div style="font-size:13px">
          ${d ? d.name : "Item"} × ${i.qty}
        </div>
      `;
    })
    .join("");

  const created = new Date(o.created);
  const canCancel = Date.now() - created.getTime() < 5 * 60 * 1000; // 5 minutes

  return `
    <div style="border:1px solid #eee;padding:10px;border-radius:8px;margin-top:8px">
      
      <div style="display:flex;justify-content:space-between">
        <div>
          <b>Order #${o.orderId}</b>
          <div class="small">${created.toLocaleString()}</div>
        </div>
        <div><b>$${o.total.toFixed(2)}</b></div>
      </div>

      <div style="margin-top:8px">
        ${rows}
      </div>

      <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
        <div class="small">Status: ${o.status}</div>

        ${
          canCancel && o.status === "Pending"
            ? `<button class="btn" onclick="cancelOrder(${o.orderId})">
                 Cancel
               </button>`
            : ""
        }
      </div>

    </div>
  `;
}

function renderOrdersPage() {
  const user = localStorage.getItem("currentUser");
  const container = document.getElementById("ordersListId");

  if (!user) {
    container.innerHTML = "Please login to see your orders.";
    return;
  }

  const userOrders = orders.filter((o) => o.user === user);

  if (userOrders.length === 0) {
    container.innerHTML = "No orders yet.";
    return;
  }

  container.innerHTML = userOrders
    .map(
      (o) => `
    <div class="order-card">
      <h4>Order #${o.orderId}</h4>
      <p>Status: ${o.status}</p>
      <p>Total: $${o.total.toFixed(2)}</p>
      <p>Date: ${new Date(o.created).toLocaleString()}</p>
      <button class="btn btn-primary" onclick="cancelOrder(${
        o.orderId
      })">cancel</button>
    </div>
  `
    )
    .join("");
}

function cancelOrder(orderId) {
  const idx = orders.findIndex((x) => x.orderId === orderId);
  if (idx === -1) return;
  orders[idx].status = "Cancelled";
  localStorage.setItem("orders", JSON.stringify(orders));
  openOrders();
  alert("Order cancelled");
}

// ---------- Authentication (simple, localStorage) ----------
function showLogin() {
  window.location.href = "login.html";
}
function showRegister() {
  window.location.href = "login.html";
}

function register() {
  const u = (
    (document.getElementById("reUser") &&
      document.getElementById("reUser").value) ||
    ""
  ).trim();
  const p =
    (document.getElementById("rePass") &&
      document.getElementById("rePass").value) ||
    "";
  if (!u || !p) return alert("Enter username and password");
  if (users.find((x) => x.user === u)) return alert("User exists");
  users.push({ user: u, pass: p });
  localStorage.setItem("users", JSON.stringify(users));
  currentUser = u;
  localStorage.setItem("currentUser", currentUser);
  closeModal("registerModal");
  updateAuthUI();
  window.location.href = "index.html";
}

function login() {
  const u = (
    (document.getElementById("liUser") &&
      document.getElementById("liUser").value) ||
    ""
  ).trim();
  const p =
    (document.getElementById("liPass") &&
      document.getElementById("liPass").value) ||
    "";
  if (!u || !p) return alert("Enter username and password");
  if (u === adminCred.user && p === adminCred.pass) {
    currentUser = u;
    localStorage.setItem("currentUser", currentUser);
    updateAuthUI();
    window.location.href = "index.html";
    showAdmin(true);

    return;
  }
  const found = users.find((x) => x.user === u && x.pass === p);
  if (found) {
    currentUser = u;
    localStorage.setItem("currentUser", currentUser);
    closeModal("loginModal");
    updateAuthUI();

    window.location.href = "index.html";
  } else alert("Invalid credentials");
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const toggleBtn = input.parentNode.querySelector(".password-toggle i");

  if (input.type === "password") {
    input.type = "text";
    toggleBtn.className = "fas fa-eye-slash";
  } else {
    input.type = "password";
    toggleBtn.className = "fas fa-eye";
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateAuthUI();
}

function updateAuthUI() {
  const navLogin = document.getElementById("navLogin");
  const navRegister = document.getElementById("navRegister");
  if (!navLogin || !navRegister) return;
  navLogin.textContent = currentUser ? `Hello, ${currentUser}` : "Login";
  navLogin.onclick = currentUser ? openOrders : showLogin;
  navRegister.textContent = currentUser ? "Logout" : "Sign up";
  if (currentUser) navRegister.onclick = logout;
  else navRegister.onclick = showRegister;
}

// ---------- Admin: Manage menu items (add/remove) ----------
function showAdmin(bypass) {
  const el = document.getElementById("adminModalContent");
  el.innerHTML = `
  <h3>Admin</h3>
  <div>
    <label>Username</label>
    <input id='adUser' style='width:100%;padding:8px;margin-top:6px'>
    <label style='margin-top:8px'>Password</label>
    <input id='adPass' type='password' style='width:100%;padding:8px;margin-top:6px'>
  </div>
  <div style='margin-top:10px;display:flex;gap:8px'>
    <button class='btn' onclick='adminLogin()'>Login</button>
    <button class='btn secondary' onclick="closeModal('adminModal')">Close</button>
  </div>
  <hr>
  <div id='adminArea'></div>`;
  openModal("adminModal");
  if (bypass) adminAuth(true);
}

function adminLogin() {
  const u =
    (document.getElementById("adUser") &&
      document.getElementById("adUser").value) ||
    "";
  const p =
    (document.getElementById("adPass") &&
      document.getElementById("adPass").value) ||
    "";
  if (u === adminCred.user && p === adminCred.pass) adminAuth(true);
  else alert("Invalid admin");
}

function adminAuth(ok) {
  if (!ok) return;
  const area = document.getElementById("adminArea");
  if (!area) return;
  area.innerHTML = `
    <h4>Manage Menu</h4>
    <div style='display:flex;flex-direction:column;gap:8px'>
      <input id='newName' placeholder='Dish name' style='padding:8px'>
      <input id='newCat' placeholder='Category' style='padding:8px'>
      <input id='newPrice' placeholder='Price' style='padding:8px'>
      <input id='newImg' placeholder='Image URL (optional)' style='padding:8px'>
      <textarea id='newDesc' placeholder='Description' style='padding:8px'></textarea>
      <div style='display:flex;gap:8px'>
        <button class='btn' onclick='addDish()'>Add Dish</button>
        <button class='btn secondary' onclick="renderAdminList()">Refresh</button>
      </div>
    </div>
    <div id='adminList' style='margin-top:12px'></div>`;
  renderAdminList();
}

function addDish() {
  const n =
    (document.getElementById("newName") &&
      document.getElementById("newName").value) ||
    "";
  const c =
    (document.getElementById("newCat") &&
      document.getElementById("newCat").value) ||
    "Uncategorized";
  const p = parseFloat(
    (document.getElementById("newPrice") &&
      document.getElementById("newPrice").value) ||
      0
  );
  const img =
    (document.getElementById("newImg") &&
      document.getElementById("newImg").value) ||
    "https://picsum.photos/seed/" +
      Math.floor(Math.random() * 1000) +
      "/400/300";
  const desc =
    (document.getElementById("newDesc") &&
      document.getElementById("newDesc").value) ||
    "";
  if (!n) return alert("Please enter a dish name");
  const id = Date.now();
  dishes.push({ id, name: n, price: p, category: c, img, desc });
  localStorage.setItem("dishes", JSON.stringify(dishes));
  populateCategories();
  renderMenu();
  renderAdminList();
  alert("Dish added");
}

function renderAdminList() {
  const el = document.getElementById("adminList");
  if (!el) return;
  el.innerHTML = dishes
    .map(
      (d) =>
        `<div style='display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid #eee'>
      <div><b>${d.name}</b><div class='small'>${d.category} • $${d.price}</div>
      </div><div>
      <button class='btn' onclick='removeDish(${d.id})'>Remove</button>
      </div></div>`
    )
    .join("");
}

function removeDish(id) {
  dishes = dishes.filter((d) => d.id !== id);
  localStorage.setItem("dishes", JSON.stringify(dishes));
  populateCategories();
  renderMenu();
  renderAdminList();
}

// ---------- Helpers: modal open/close ----------
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "flex";
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

// ---------- Checkout (modal with address + payment) ----------
function openCheckout() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }
  if (!currentUser) {
    alert("Please login first");
    showLogin();
    return;
  }

  let total = 0;
  const summary = cart
    .map((c) => {
      const d = dishes.find((x) => x.id === c.id);
      total += d ? d.price * c.qty : 0;
      return `
      <div style='display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee'>
        <div>${d ? d.name : "Item"} × ${c.qty}</div>
        <div>$${d ? (d.price * c.qty).toFixed(2) : "0.00"}</div>
      </div>`;
    })
    .join("");

  const html = `
    <h2>Checkout</h2>
    <h3>Delivery Address</h3>
    <input id='addrName' placeholder='Full Name' style='width:100%;padding:8px;margin:4px 0'>
    <input id='addrPhone' placeholder='Phone Number' style='width:100%;padding:8px;margin:4px 0'>
    <textarea id='addrDetails' placeholder='Street, Building, Apartment' style='width:100%;padding:8px;margin:4px 0'></textarea>

    <h3 style='margin-top:10px'>Payment Method</h3>
    <label><input type='radio' name='pay' value='card' checked> Credit/Debit Card</label><br>
    <label><input type='radio' name='pay' value='cod'> Cash on Delivery</label>

    <h3 style='margin-top:10px'>Order Summary</h3>
    ${summary}
    <div style='display:flex;justify-content:space-between;margin-top:10px'><b>Total:</b> <b>$${total.toFixed(
      2
    )}</b></div>

    <div style='margin-top:15px;display:flex;gap:10px'>
      <button class='btn' onclick='finalizeOrder()'>Place Order</button>
      <button class='btn secondary' onclick="closeModal('checkoutModal')">Cancel</button>
    </div>`;

  document.getElementById("checkoutContent").innerHTML = html;
  openModal("checkoutModal");
}

function finalizeOrder() {
  const name = (
    (document.getElementById("addrName") &&
      document.getElementById("addrName").value) ||
    ""
  ).trim();
  const phone = (
    (document.getElementById("addrPhone") &&
      document.getElementById("addrPhone").value) ||
    ""
  ).trim();
  const details = (
    (document.getElementById("addrDetails") &&
      document.getElementById("addrDetails").value) ||
    ""
  ).trim();
  const payEl = document.querySelector("input[name='pay']:checked");
  const pay = payEl ? payEl.value : "cod";

  if (!name || !phone || !details)
    return alert("Please fill all address fields");

  const id = Date.now();
  const created = new Date().toISOString();
  const orderItems = cart.map((c) => ({ id: c.id, qty: c.qty }));
  const total = cart.reduce((s, c) => {
    const d = dishes.find((x) => x.id === c.id);
    return s + (d ? d.price * c.qty : 0);
  }, 0);

  const order = {
    orderId: id,
    user: currentUser,
    items: orderItems,
    total,
    created,
    status: "Pending",
    address: { name, phone, details },
    payment: pay,
  };

  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  cart = [];
  saveCart();
  updateCartCount();
  renderCartSidebar();
  closeModal("checkoutModal");
}

function openHome() {
  window.location.href = "index.html";
}

function switchTab(tabName) {
  // Update tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelectorAll(".auth-form").forEach((form) => {
    form.classList.remove("active");
  });

  // Activate selected tab
  if (tabName === "login") {
    document.querySelector(".tab-btn:first-child").classList.add("active");
    document.getElementById("login-form").classList.add("active");
  } else {
    document.querySelector(".tab-btn:last-child").classList.add("active");
    document.getElementById("register-form").classList.add("active");
  }
}

// init
populateCategories();
renderMenu();
updateCartCount();
updateAuthUI();

// close modals on click outside
document.querySelectorAll(".modal").forEach((m) =>
  m.addEventListener("click", (e) => {
    if (e.target === m) m.style.display = "none";
  })
);
