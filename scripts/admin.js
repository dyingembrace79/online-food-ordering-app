console.log("admin.js loaded");

// ---------------------------
// Admin Login + Logout
// ---------------------------
function handleAdminLogin(e) {
    
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    

    if (username === "admin" && password === "password123") {
        document.querySelector(".box").style.display = "none"; // hide login
        document.getElementById("adminPanel").classList.remove("hidden"); // show dashboard
   
        showAdminTab('orders'); // default tab
       
        
    } else {
        alert("Invalid login. Use admin / password123");
    }
}

function logoutAdmin() {
    document.getElementById("adminPanel").classList.add("hidden");
    document.querySelector(".box").style.display = "block";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}
// ---------------------------
// Admin Tabs Switching
// ---------------------------
function showAdminTab(tabName) {
    try {
      console.log("showAdminTab function called");
     console.log("tabName:", tabName);
    const tabs = document.querySelectorAll(".admin-tab-content");
    tabs.forEach(tab => tab.classList.add("hidden"));

    const target = document.getElementById(tabName + "Tab");
    if (target) target.classList.remove("hidden");

    document.querySelectorAll(".admin-tab-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = [...document.querySelectorAll(".admin-tab-btn")]
        .find(btn => btn.getAttribute("onclick").includes(tabName));
    if (activeBtn) activeBtn.classList.add("active");

    if (tabName === "orders") setTimeout(renderOrders, 100); // Wait for 1 second before renderOrders;
    if (tabName === "menu") setTimeout(renderMenu, 100); // Wait for 1 second before renderMenu;
    if (tabName === "analytics") renderAnalytics();
    } catch (error) {console.error(" error in showAdminTab:", error);
        
    }
}


// ---------------------------
// Orders Rendering-- Ran out of time to implement order status updates
// ---------------------------
function renderOrders() {
    const ordersList = document.getElementById("ordersList");
    ordersList.innerHTML = "";

    if (!window.orders || window.orders.length === 0) {
        ordersList.innerHTML = `<p class="text-gray-500 text-center py-8">No orders yet.</p>`;
        return;
    }

if (window.orders && window.orders.length > 0) {
    window.orders.forEach((order) => {
        const div = document.createElement("div");
        div.className = "border-b py-4";
        div.innerHTML = `
            <div class="flex justify-between">
                <div>
                    <p class="font-bold">Order #${order.id}</p>
                    <p class="text-gray-600">${order.items.map(i => i.name + ' x' + (i.qty || i.quantity)).join(", ")}</p>
                    <p class="text-sm text-gray-500">${new Date(order.timestamp).toLocaleString()}</p>
                </div>
                <div class="text-green-600 font-bold">$${order.total.toFixed(2)}</div>
            </div>
        `;
        ordersList.appendChild(div);
    });
    }
}
// ---------------------------
// Menu Management- Working but does not interact with app.js menu
// ---------------------------
function renderMenu() {
    const adminMenuList = document.getElementById("adminMenuList");
    console.log(adminMenuList);
    adminMenuList.innerHTML = "";

    if (!window.menuItems || window.menuItems.length === 0) {
        adminMenuList.innerHTML = `<p class="text-gray-500">No menu items yet.</p>`;
        return;
    }

    window.menuItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "border-b py-2 flex justify-between items-center";
        div.innerHTML = `
            <div>
                <p class="font-bold">${item.emoji} ${item.name}</p>
                <p class="text-gray-600">${item.description}</p>
                <p class="text-sm text-gray-500">Category: ${item.category}</p>
            </div>
            <div class="text-right">
                <div class="font-bold text-lg">$${item.price.toFixed(2)}</div>
                <button onclick="removeMenuItem(${item.id})" 
                        class="text-red-500 hover:text-red-700 text-sm mt-1">
                    Remove
                </button>
            </div>
        `;
        adminMenuList.appendChild(div);
    });
}
window.menuItems = window.menuItems || [];
function addMenuItem(e) {
    console.log('addMenuItem function defined:', addMenuItem);
    e.preventDefault();

    const name = document.getElementById("itemName").value.trim();
    const price = parseFloat(document.getElementById("itemPrice").value);
    const category = document.getElementById("itemCategory").value;
    const emoji = document.getElementById("itemEmoji").value;
    const description = document.getElementById("itemDescription").value;

    if (!name || !price || !category || !emoji || !description) {
        alert("Please fill all fields");
        return;
    }

    const newItem = { id: Date.now(), name, price, category, emoji, description };
    window.menuItems.push(newItem);

    renderMenu();
    updateAdminDashboard();
    e.target.reset();
    
    // Show success message
    alert("Menu item added successfully!");
}
window.addMenuItem = addMenuItem; // Expose to global scope for inline onclick

function removeMenuItem(itemId) {
    if (confirm("Are you sure you want to remove this menu item?")) {
        window.menuItems = window.menuItems.filter(item => item.id !== itemId);
        renderMenu();
        updateAdminDashboard();
    }
}

// ---------------------------
// Analytics- was not able to implement charts due to time constraints
// ---------------------------
function renderAnalytics() {
    const popularItemsDiv = document.getElementById("popularItems");
    const orderTrendsDiv = document.getElementById("orderTrends");

    if (!window.orders || window.orders.length === 0) {
        popularItemsDiv.innerHTML = `<p class="text-gray-500">No data yet.</p>`;
        orderTrendsDiv.innerHTML = `<p class="text-gray-500">No trends available.</p>`;
        return;
    }

    // Count item frequency
    const itemCount = {};
    window.orders.forEach(order => {
        order.items.forEach(i => {
            const qty = i.qty || i.quantity || 1;
            itemCount[i.name] = (itemCount[i.name] || 0) + qty;
        });
    });

    // Popular items
    const popular = Object.entries(itemCount).sort((a,b) => b[1] - a[1]);
    popularItemsDiv.innerHTML = popular.length > 0 ? 
        popular.slice(0, 5).map(([name, qty]) =>
            `<div class="flex justify-between py-1">
                <span>${name}</span>
                <span class="font-bold text-green-600">${qty} sold</span>
            </div>`).join("") :
        `<p class="text-gray-500">No items sold yet.</p>`;

    // Order trends
    const recentOrders = window.orders.slice(-10).reverse(); // Show last 10 orders
    orderTrendsDiv.innerHTML = recentOrders.length > 0 ?
        `<div class="space-y-2">
            <h4 class="font-semibold text-sm text-gray-700">Recent Orders</h4>
            ${recentOrders.map(o =>
                `<div class="flex justify-between text-sm py-1 border-b border-gray-100">
                    <span>Order #${o.id}</span>
                    <span class="font-medium text-green-600">$${o.total.toFixed(2)}</span>
                </div>`).join("")}
        </div>` :
        `<p class="text-gray-500">No order trends available.</p>`;
}

// ---------------------------
// Dashboard Stats - tried implement a different way to update stats
// ---------------------------
function updateAdminDashboard() {
    var totalOrdersElement = document.getElementById("totalOrders");
    var totalRevenueElement = document.getElementById("totalRevenue");
    var totalMenuItemsElement = document.getElementById("totalMenuItems");
    var activeOrdersElement = document.getElementById("activeOrders");

    // Initialize arrays if they don't exist
    if (!window.orders) window.orders = [];
    if (!window.menuItems) window.menuItems = [];

    // Calculate statistics
    const totalOrders = window.orders.length;
    const totalRevenue = window.orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalMenuItems = window.menuItems.length;
    const activeOrders = window.orders.filter(order => 
        !order.status || order.status === 'pending' || order.status === 'active'
    ).length;

    // Update dashboard elements if they exist
    if (totalOrdersElement) {
        totalOrdersElement.textContent = totalOrders;
    }
    if (totalRevenueElement) {
        totalRevenueElement.textContent = `$${totalRevenue.toFixed(2)}`;
    }
    if (totalMenuItemsElement) {
        totalMenuItemsElement.textContent = totalMenuItems;
    }
    if (activeOrdersElement) {
        activeOrdersElement.textContent = activeOrders;
    }

    // Also update any currently visible tabs
    const currentTab = document.querySelector('.admin-tab-content:not(.hidden)');
    if (currentTab) {
        const tabId = currentTab.id;
        if (tabId === 'ordersTab') renderOrders();
        else if (tabId === 'menuTab') renderMenu();
        else if (tabId === 'analyticsTab') renderAnalytics();
    }

    console.log('Dashboard updated:', { totalOrders, totalRevenue, totalMenuItems, activeOrders });
}

// ---------------------------
// Expose functions to global scope
// ---------------------------
window.handleAdminLogin = handleAdminLogin;
window.logoutAdmin = logoutAdmin;
window.showAdminTab = showAdminTab;
window.addMenuItem = addMenuItem;
window.removeMenuItem = removeMenuItem;
window.updateAdminDashboard = updateAdminDashboard;
window.renderOrders = renderOrders;
window.renderMenu = renderMenu;
window.renderAnalytics = renderAnalytics;



// ---------------------------