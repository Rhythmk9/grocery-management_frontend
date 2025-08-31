// Sample data for grocery items
const sampleItems = [
    { id: 1, name: "MILK", price: 60, quantity: 150 },
    { id: 2, name: "MEAT", price: 200, quantity: 100 },
    { id: 3, name: "CHIPS", price: 35, quantity: 200 },
    { id: 4, name: "BISCUITS", price: 50, quantity: 50 },
    { id: 5, name: "BREAD", price: 60, quantity: 30 },
    { id: 6, name: "EGGS", price: 10, quantity: 60 },
    { id: 7, name: "NAMKEEN", price: 300, quantity: 25 },
    { id: 8, name: "RICE", price: 75, quantity: 40 },
    { id: 9, name: "FRUITS", price: 45, quantity: 80 },
    { id: 10, name: "VEGETABLES", price: 35, quantity: 90 }
];

const sampleOrders = [
    { 
        id: "order-001", 
        customer: "ADITYA ARYAN",
        date: "4/14/2025, 4:00:00 PM", 
        items: [
            { name: "Milk", quantity: 2, price: 60 },
            { name: "Bread", quantity: 1, price: 60 },
            { name: "Eggs", quantity: 1, price: 10 }
        ],
        total: 190
    },
    { 
        id: "order-002", 
        customer: "MEHAK",
        date: "4/13/2025, 7:45:00 PM", 
        items: [
            { name: "NAMKEEN", quantity: 3, price: 300 },
            { name: "FRUITS", quantity: 2, price: 45 }
        ],
        total: 990
    },
    { 
        id: "order-003", 
        customer: "GEETANSH",
        date: "4/13/2025, 3:15:00 PM", 
        items: [
            { name: "MEAT", quantity: 1, price: 200 },
            { name: "RICE", quantity: 1, price: 75 }
        ],
        total: 275
    },
];

let currentBill = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } else {
        initializeDashboard();
    }
});

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'password') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('login-error').textContent = 'Invalid username or password';
    }
}

// Initialize dashboard after login
function initializeDashboard() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    // Setup navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.id === 'logoutBtn') {
                handleLogout();
                return;
            }
            
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const pageId = this.getAttribute('data-page') + '-page';
            document.querySelectorAll('.page').forEach(page => {
                page.style.display = 'none';
            });
            document.getElementById(pageId).style.display = 'block';
        });
    });
    
    // Load data for different sections
    loadStockData();
    loadBillingItems();
    loadOrderHistory();
    
    // Setup event listeners
    const completeBillBtn = document.getElementById('complete-bill');
    if (completeBillBtn) {
        completeBillBtn.addEventListener('click', completeOrder);
    }
    
    const closeModal = document.querySelector('.close');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            document.getElementById('order-details-modal').style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('order-details-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Setup search functionality for orders
    const orderSearch = document.getElementById('orderSearch');
    if (orderSearch) {
        orderSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredOrders = sampleOrders.filter(order => 
                order.customer.toLowerCase().includes(searchTerm) || 
                order.id.toLowerCase().includes(searchTerm)
            );
            populateOrdersTable(filteredOrders);
        });
    }
    
    // Check if cart is empty on page load
    updateCartVisibility();
}

// Load stock data
function loadStockData() {
    const stockTableBody = document.getElementById('stock-table-body');
    if (!stockTableBody) return;
    
    stockTableBody.innerHTML = '';
    
    sampleItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
        `;
        stockTableBody.appendChild(row);
    });
}

// Load billing items
function loadBillingItems() {
    const billingItems = document.getElementById('billing-items');
    if (!billingItems) return;
    
    billingItems.innerHTML = '';
    
    sampleItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>
                <button class="btn-add" onclick="addToBill(${item.id})">Add</button>
            </td>
        `;
        billingItems.appendChild(row);
    });
    
    updateBillDisplay();
}

// Load order history
function loadOrderHistory() {
    populateOrdersTable(sampleOrders);
}

// Populate orders table with data
function populateOrdersTable(orders) {
    const ordersTableBody = document.getElementById('orders-table-body');
    if (!ordersTableBody) return;
    
    ordersTableBody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>₹${order.total.toFixed(2)}</td>
            <td><button class="btn-primary" onclick="showOrderDetails(${JSON.stringify(order.id)})">View</button></td>
        `;
        ordersTableBody.appendChild(row);
    });
}

// Add item to current bill
function addToBill(itemId) {
    const item = sampleItems.find(item => item.id === itemId);
    if (!item || item.quantity <= 0) return;
    
    const existingItem = currentBill.find(billItem => billItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
        existingItem.total = existingItem.quantity * existingItem.price;
    } else {
        currentBill.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            total: item.price
        });
    }
    
    item.quantity--;
    
    updateBillDisplay();
    loadBillingItems();
    loadStockData();
    updateCartVisibility();
}

// Update bill display
function updateBillDisplay() {
    const billItems = document.getElementById('bill-items');
    const billTotalAmount = document.getElementById('bill-total-amount');
    const billTable = document.getElementById('bill-table');
    
    if (!billItems || !billTotalAmount) return;
    
    billItems.innerHTML = '';
    
    let total = 0;
    
    currentBill.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                </div>
            </td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>₹${item.total.toFixed(2)}</td>
        `;
        billItems.appendChild(row);
        
        total += item.total;
    });
    
    billTotalAmount.textContent = total.toFixed(2);
}

// Update cart visibility based on items
function updateCartVisibility() {
    const emptyCart = document.getElementById('empty-cart');
    const billTable = document.getElementById('bill-table');
    const billTotal = document.querySelector('.bill-total');
    const completeBtn = document.getElementById('complete-bill');
    
    if (!emptyCart || !billTable || !billTotal || !completeBtn) return;
    
    if (currentBill.length === 0) {
        emptyCart.style.display = 'flex';
        billTable.style.display = 'none';
        billTotal.style.display = 'none';
        completeBtn.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        billTable.style.display = 'table';
        billTotal.style.display = 'block';
        completeBtn.style.display = 'block';
    }
}

// Increase item quantity in bill
function increaseQuantity(itemId) {
    const item = sampleItems.find(item => item.id === itemId);
    const billItem = currentBill.find(billItem => billItem.id === itemId);
    
    if (!item || !billItem || item.quantity <= 0) return;
    
    billItem.quantity++;
    billItem.total = billItem.quantity * billItem.price;
    
    item.quantity--;
    
    updateBillDisplay();
    loadStockData();
    loadBillingItems();
}

// Decrease item quantity in bill
function decreaseQuantity(itemId) {
    const item = sampleItems.find(item => item.id === itemId);
    const billItem = currentBill.find(billItem => billItem.id === itemId);
    const billItemIndex = currentBill.findIndex(billItem => billItem.id === itemId);
    
    if (!item || !billItem || billItem.quantity <= 0) return;
    
    billItem.quantity--;
    
    if (billItem.quantity === 0) {
        currentBill.splice(billItemIndex, 1);
    } else {
        billItem.total = billItem.quantity * billItem.price;
    }
    
    item.quantity++;
    
    updateBillDisplay();
    loadStockData();
    loadBillingItems();
    updateCartVisibility();
}

// Complete order
function completeOrder() {
    if (currentBill.length === 0) {
        alert('No items in the current bill!');
        return;
    }
    
    const customerName = document.getElementById('customerName').value || 'Guest';
    const total = currentBill.reduce((sum, item) => sum + item.total, 0);
    
    const newOrder = {
        id: 'order-' + (sampleOrders.length + 1).toString().padStart(3, '0'),
        customer: customerName,
        date: new Date().toLocaleString(),
        items: currentBill.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: total
    };
    
    sampleOrders.unshift(newOrder);
    
    currentBill = [];
    
    updateBillDisplay();
    loadOrderHistory();
    updateCartVisibility();
    
    // Reset customer name field
    document.getElementById('customerName').value = '';
    
    alert('Order completed successfully!');
}

// Show order details
// Show order details
function showOrderDetails(orderId) {
    // Remove any quotes if the ID was stringified
    orderId = orderId.replace(/"/g, '');
    
    const order = sampleOrders.find(order => order.id === orderId);
    if (!order) {
        console.error('Order not found:', orderId);
        return;
    }
    
    const modal = document.getElementById('order-details-modal');
    const modalContent = document.getElementById('order-details-content');
    
    modalContent.innerHTML = `
        <h3>Order ${order.id}</h3>
        <p><strong>Customer:</strong> ${order.customer}</p>
        <p><strong>Date:</strong> ${order.date}</p>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price.toFixed(2)}</td>
                        <td>₹${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                    <td>₹${order.total.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
    `;
    
    modal.style.display = 'block';
}
// Populate orders table with data
function populateOrdersTable(orders) {
    const ordersTableBody = document.getElementById('orders-table-body');
    if (!ordersTableBody) return;
    
    ordersTableBody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>₹${order.total.toFixed(2)}</td>
            <td><button class="btn-primary" onclick="showOrderDetails('${order.id}')">View</button></td>
        `;
        ordersTableBody.appendChild(row);
    });
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}