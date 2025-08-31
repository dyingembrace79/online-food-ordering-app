// ---------------------------
// Customer Interface (app.js)
// ---------------------------

// Initialize global data - use window object directly
window.menuItems = window.menuItems || [
    { id: 1, name: "Margherita Pizza", price: 12.99, category: "pizza", emoji: "🍕", description: "Classic tomato, mozzarella, and basil" },
    { id: 2, name: "Pepperoni Pizza", price: 15.99, category: "pizza", emoji: "🍕", description: "Pepperoni with mozzarella cheese" },
    { id: 3, name: "Veggie Supreme", price: 16.99, category: "pizza", emoji: "🍕", description: "Bell peppers, mushrooms, onions, olives" },
    { id: 4, name: "Classic Burger", price: 8.99, category: "burger", emoji: "🍔", description: "Beef patty, lettuce, tomato, onion" },
    { id: 5, name: "Cheese Burger", price: 9.99, category: "burger", emoji: "🍔", description: "Classic burger with melted cheese" },
    { id: 6, name: "Chicken Burger", price: 10.99, category: "burger", emoji: "🍔", description: "Grilled chicken breast with veggies" },
    { id: 7, name: "Coca Cola", price: 2.99, category: "drinks", emoji: "🥤", description: "Refreshing cola drink" },
    { id: 8, name: "Orange Juice", price: 3.99, category: "drinks", emoji: "🧃", description: "Fresh squeezed orange juice" },
    { id: 9, name: "Iced Coffee", price: 4.99, category: "drinks", emoji: "☕", description: "Cold brew coffee with ice" },
    { id: 10, name: "Chocolate Cake", price: 6.99, category: "dessert", emoji: "🍰", description: "Rich chocolate layer cake" },
    { id: 11, name: "Ice Cream", price: 4.99, category: "dessert", emoji: "🍦", description: "Vanilla ice cream with toppings" },
    { id: 12, name: "Apple Pie", price: 5.99, category: "dessert", emoji: "🥧", description: "Homemade apple pie slice" }
];

window.orders = window.orders || [];

// Application state - keep these local
let cart = [];
let currentFilter = 'all';

// ---------------------------
// Menu Display
// ---------------------------
function displayMenu(items) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';

    items.forEach(item => {
        const menuCard = document.createElement('div');
        menuCard.className = 'bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow fade-in';
        menuCard.innerHTML = `
            <div class="p-6">
                <div class="text-6xl text-center mb-4">${item.emoji}</div>
                <h3 class="text-xl font-bold mb-2 text-center">${item.name}</h3>
                <p class="text-gray-600 text-sm mb-4 text-center">${item.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold text-red-600">$${item.price}</span>
                    <button onclick="addToCart(${item.id})" 
                            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        menuGrid.appendChild(menuCard);
    });
}

// ---------------------------
// Filter Menu
// ---------------------------
function filterMenu(category, event) {
    currentFilter = category;
    const filteredItems = category === 'all' ? window.menuItems : window.menuItems.filter(item => item.category === category);
    displayMenu(filteredItems);

    // Update active button styling
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('bg-red-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });

    if (event && event.target) {
        event.target.classList.remove('bg-gray-200', 'text-gray-700');
        event.target.classList.add('bg-red-600', 'text-white');
    }
}

// ---------------------------
// Cart Management
// ---------------------------
function addToCart(itemId) {
    const item = window.menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);

    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...item, quantity: 1 });

    updateCartUI();

    const cartBtn = document.getElementById('cartBtn');
    cartBtn.classList.add('cart-animation');
    setTimeout(() => cartBtn.classList.remove('cart-animation'), 300);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal'); 
    const modalTotal = document.getElementById('modalTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotal) cartTotal.textContent = `$${totalPrice.toFixed(2)}`; 
    if (modalTotal) modalTotal.textContent = totalPrice.toFixed(2);
}

function showCart() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center py-4">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="flex justify-between items-center py-2 border-b">
                <div>
                    <span class="font-medium">${item.name}</span>
                    <div class="text-sm text-gray-500">$${item.price} each</div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="updateQuantity(${item.id}, -1)" class="bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300 transition">-</button>
                    <span class="px-2 font-medium">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300 transition">+</button>
                    <button onclick="removeFromCart(${item.id})" class="text-red-500 ml-2 hover:text-red-700 transition">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    updateCartUI();
    modal.classList.remove('hidden');
}

function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) removeFromCart(itemId);
    else showCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    showCart();
}

function closeCart() {
    document.getElementById('cartModal').classList.add('hidden');
}

// ---------------------------
// Checkout - FIXED VERSION
// ---------------------------
function checkout() {
    if (cart.length === 0) return alert("Your cart is empty!");

    const orderNumber = Math.floor(Math.random() * 90000) + 10000;
    document.getElementById('orderNumber').textContent = orderNumber;

    const order = {
        id: orderNumber,
        items: cart.map(i => ({ ...i, qty: i.quantity })), // qty for admin
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date(),
        status: 'pending'
    };
    
    // Push to window.orders, not local orders
    window.orders.push(order);

    // Update admin dashboard if loaded
    if (typeof window.updateAdminDashboard === 'function') {
        window.updateAdminDashboard();
    }

    cart = [];
    updateCartUI();
    closeCart();
    document.getElementById('successModal').classList.remove('hidden');
}

function closeSuccess() {
    document.getElementById('successModal').classList.add('hidden');
}

// ---------------------------
// Init
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
    displayMenu(window.menuItems);

    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) cartBtn.addEventListener('click', showCart);

    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.addEventListener('click', e => {
        if (e.target === cartModal) closeCart();
    });

    const successModal = document.getElementById('successModal');
    if (successModal) successModal.addEventListener('click', e => {
        if (e.target === successModal) closeSuccess();
    });
});

// ---------------------------
// Expose functions globally for HTML onclick handlers
// ---------------------------
window.addToCart = addToCart;
window.filterMenu = filterMenu;
window.showCart = showCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.closeCart = closeCart;
window.checkout = checkout;
window.closeSuccess = closeSuccess;