let cart = [];

const menuItems = [
    {
        name: "Margherita",
        description: "Classic tomato sauce, mozzarella, fresh basil",
        price: 12.99,
        image: "https://www.heart.org/-/media/AHA/Recipe/Recipe-Images/Classic-Margherita-Pizza-with-Whole-Wheat-Pizza-Crust.jpg?h=922&w=1200&sc_lang=en&hash=BC11D7BCD33CFAD57790BB8779E746CF"
    },
    {
        name: "Pepperoni",
        description: "Tomato sauce, mozzarella, lots of pepperoni",
        price: 14.99,
        image: "https://www.moulinex-me.com/medias/?context=bWFzdGVyfHJvb3R8MTQzNTExfGltYWdlL2pwZWd8YUdObEwyaG1aQzh4TlRrMk9EWXlOVGM0TmpreE1DNXFjR2N8MmYwYzQ4YTg0MTgzNmVjYTZkMWZkZWZmMDdlMWFlMjRhOGIxMTQ2MTZkNDk4ZDU3ZjlkNDk2MzMzNDA5OWY3OA"
    },
    {
        name: "Veggie Supreme",
        description: "Mushrooms, bell peppers, onions, olives",
        price: 13.99,
        image: "https://www.thursdaynightpizza.com/wp-content/uploads/2022/06/veggie-pizza-side-view-out-of-oven-720x480.png"
    }
];

function displayMenu() {
    const container = document.getElementById("menu-container");
    container.innerHTML = "";
    menuItems.forEach((pizza, index) => {
        const card = document.createElement("div");
        card.className = "pizza-card";
        card.innerHTML = `
            <img src="${pizza.image}" alt="${pizza.name}">
            <h3>${pizza.name}</h3>
            <p>${pizza.description}</p>
            <p><strong>$${pizza.price}</strong></p>
            <button onclick="showCustomizationPanel(${index})">Customize & Add</button>
        `;
        container.appendChild(card);
    });
}

function showCustomizationPanel(index) {
    const existing = document.querySelector(".customization-panel");
    if (existing) existing.remove();
    const pizza = menuItems[index];
   
    const panel = document.createElement("div");
    panel.className = "customization-panel";
    panel.innerHTML = `
        <h3>Customize ${pizza.name}</h3>
       
        <div class="option-group">
            <label>Size:</label>
            <select id="size-select">
                <option value="Small">Small (-$2.00)</option>
                <option value="Medium" selected>Medium</option>
                <option value="Large">Large (+$3.00)</option>
            </select>
        </div>
       
        <div class="option-group">
            <label>Crust:</label>
            <select id="crust-select">
                <option value="Regular">Regular</option>
                <option value="Thin">Thin</option>
                <option value="Stuffed">Stuffed</option>
            </select>
        </div>
       
        <div class="option-group">
            <label>Toppings (optional):</label>
            <input type="text" id="toppings-input" placeholder="e.g. mushrooms, olives">
        </div>
       
        <div class="panel-buttons">
            <button onclick="addCustomizedPizza(${index}, this)">Add to Cart</button>
            <button onclick="this.parentElement.parentElement.remove()">Cancel</button>
        </div>
    `;
   
    const menuSection = document.querySelector("main");
    menuSection.appendChild(panel);
}

function addCustomizedPizza(index, button) {
    const panel = button.parentElement.parentElement;
    const pizza = menuItems[index];
   
    const size = panel.querySelector("#size-select").value;
    const crust = panel.querySelector("#crust-select").value;
    const toppingsInput = panel.querySelector("#toppings-input").value;
   
    let finalPrice = pizza.price;
    if (size === "Small") finalPrice -= 2;
    if (size === "Large") finalPrice += 3;
   
    const toppings = toppingsInput ? toppingsInput.split(",").map(t => t.trim()) : [];
    const itemName = `${size} ${pizza.name} (${crust} crust)`;
   
    const existingItem = cart.find(item =>
        item.name === itemName &&
        JSON.stringify(item.toppings) === JSON.stringify(toppings)
    );
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            name: itemName,
            price: finalPrice,
            toppings: toppings,
            quantity: 1
        });
    }
   
    updateCartCount();
    showToast(itemName, finalPrice);
   
    panel.remove();
}

function showToast(itemName, price) {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
        <div class="toast-header">
            <span class="check">✓</span>
            <strong>Added to cart!</strong>
        </div>
        <div class="toast-body">
            <strong>${itemName}</strong><br>
            $${price.toFixed(2)}
        </div>
        <button onclick="showCart(); this.parentElement.remove();">Go to Cart</button>
    `;
   
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 4000);
}

function updateCartCount() {
    const cartLink = document.querySelector('nav a[onclick*="showCart"]');
    if (cartLink) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartLink.textContent = `Cart (${totalItems})`;
    }
}

// ==================== Cart (XSS Fixed - Safe Version) ====================
function showCart() {
    const existing = document.querySelector(".cart-modal");
    if (existing) existing.remove();
    if (cart.length === 0) {
        const emptyModal = document.createElement("div");
        emptyModal.className = "cart-modal";
        emptyModal.innerHTML = `
            <div class="modal-content" style="text-align: center; max-width: 350px;">
                <h2>Your Cart</h2>
                <p style="font-size: 18px; margin: 30px 0;">Your cart is empty.</p>
                <button onclick="closeCartModal(this)" style="background-color: #d32f2f; color: white; padding: 12px 30px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
        document.body.appendChild(emptyModal);
        return;
    }
    let itemsHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
        const qty = item.quantity || 1;
        const itemTotal = item.price * qty;
        total += itemTotal;
        // Create a safe placeholder for toppings
        let toppingsHTML = "";
        if (item.toppings && item.toppings.length > 0) {
            toppingsHTML = `<div class="cart-toppings">Toppings: <span class="toppings-text"></span></div>`;
        }
        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    ${toppingsHTML}
                </div>
               
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${index}, -1)">−</button>
                        <span>${qty}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="item-price">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    });
    const modal = document.createElement("div");
    modal.className = "cart-modal";
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Your Cart</h2>
            <div class="cart-items">
                ${itemsHTML}
            </div>
            <div class="cart-total">
                <strong>Total: $${total.toFixed(2)}</strong>
            </div>
            <div class="modal-buttons cart-action-buttons">
                <button onclick="closeCartModal(this)" class="btn-secondary">Close</button>
                <button onclick="checkout()" class="btn-checkout">Checkout</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    // === SAFE: Insert toppings using textContent (prevents XSS) ===
    const cartItems = modal.querySelectorAll(".cart-item");
    cart.forEach((item, index) => {
        if (item.toppings && item.toppings.length > 0) {
            const toppingsSpan = cartItems[index].querySelector(".toppings-text");
            if (toppingsSpan) {
                toppingsSpan.textContent = item.toppings.join(", ");
            }
        }
    });
}

function changeQuantity(index, change) {
    const item = cart[index];
    item.quantity = (item.quantity || 1) + change;
    if (item.quantity < 1) item.quantity = 1;
    updateCartCount();
    showCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    if (cart.length === 0) {
        const modal = document.querySelector(".cart-modal");
        if (modal) modal.remove();
    } else {
        showCart();
    }
}

function closeCartModal(button) {
    const modal = button.closest(".cart-modal");
    if (modal) modal.remove();
    updateCartCount();
}

// ==================== Checkout ====================
function checkout() {
    const cartModal = document.querySelector(".cart-modal");
    if (cartModal) cartModal.remove();
    const checkoutModal = document.createElement("div");
    checkoutModal.className = "cart-modal";
    checkoutModal.innerHTML = `
        <div class="modal-content checkout-modal">
            <h2>Checkout</h2>
           
            <div class="checkout-section">
                <h4>Order Summary</h4>
                <div id="checkout-summary" class="order-summary"></div>
                <div class="checkout-total">
                    <strong>Total: $${getCartTotal().toFixed(2)}</strong>
                </div>
            </div>
            <div class="checkout-section">
                <h4>Delivery Information</h4>
                <div class="form-group">
                    <label>Full Name <span style="color:red">*</span></label>
                    <input type="text" id="full-name">
                    <div class="error-message" id="error-full-name"></div>
                </div>
                <div class="form-group">
                    <label>Address <span style="color:red">*</span></label>
                    <input type="text" id="address">
                    <div class="error-message" id="error-address"></div>
                </div>
                <div class="form-group">
                    <label>Phone Number <span style="color:red">*</span></label>
                    <input type="tel" id="phone" maxlength="10">
                    <div class="error-message" id="error-phone"></div>
                </div>
            </div>
            <div class="checkout-section">
                <h4>Payment Information</h4>
                <p style="font-size: 13px; color: #666; margin-bottom: 10px;">
                    🔒 We do not store your full card details.
                </p>
                <div class="form-group">
                    <label>Card Number <span style="color:red">*</span></label>
                    <input type="text" id="card-number" maxlength="19" placeholder="1234 5678 9012 3456">
                    <div class="error-message" id="error-card-number"></div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry Date <span style="color:red">*</span></label>
                        <input type="text" id="expiry" placeholder="MM/YY" maxlength="5">
                        <div class="error-message" id="error-expiry"></div>
                    </div>
                    <div class="form-group">
                        <label>CVV <span style="color:red">*</span></label>
                        <input type="password" id="cvv" maxlength="3" placeholder="123">
                        <div class="error-message" id="error-cvv"></div>
                    </div>
                </div>
            </div>
            <div class="modal-buttons">
                <button onclick="closeCheckoutModal(this)" class="btn-secondary">Cancel</button>
                <button onclick="placeOrder(this)" class="btn-primary">Place Order</button>
            </div>
        </div>
    `;
    document.body.appendChild(checkoutModal);
    populateCheckoutSummary(checkoutModal);
    const cardInput = checkoutModal.querySelector("#card-number");
    cardInput.addEventListener("input", function() {
        let digits = this.value.replace(/\D/g, '');
        if (digits.length > 16) digits = digits.substring(0, 16);
        let formatted = '';
        for (let i = 0; i < digits.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += digits[i];
        }
        this.value = formatted;
    });
    cardInput.addEventListener("keydown", function(e) {
        const currentDigits = this.value.replace(/\D/g, '');
        if (currentDigits.length >= 16 && /[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });
    const expiryInput = checkoutModal.querySelector("#expiry");
    expiryInput.addEventListener("input", function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        this.value = value;
    });
}
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
}
function populateCheckoutSummary(modal) {
    const container = modal.querySelector("#checkout-summary");
    container.innerHTML = "";
    cart.forEach(item => {
        const qty = item.quantity || 1;
        const itemTotal = (item.price * qty).toFixed(2);
       
        const div = document.createElement("div");
        div.className = "order-item";
       
        const span1 = document.createElement("span");
        span1.textContent = `${qty}× ${item.name}`;
       
        if (item.toppings && item.toppings.length > 0) {
            const toppingsSpan = document.createElement("span");
            toppingsSpan.style.color = "#666";
            toppingsSpan.textContent = ` (${item.toppings.join(", ")})`;
            span1.appendChild(toppingsSpan);
        }
       
        const span2 = document.createElement("span");
        span2.textContent = `$${itemTotal}`;
       
        div.appendChild(span1);
        div.appendChild(span2);
        container.appendChild(div);
    });
}
function closeCheckoutModal(button) {
    const modal = button.closest(".cart-modal");
    if (modal) modal.remove();
    updateCartCount();
}
// ==================== Place Order ====================
function placeOrder(button) {
    const modal = button.closest(".cart-modal");
    clearErrors(modal);
    let isValid = true;
    const fullName = modal.querySelector("#full-name").value.trim();
    const address = modal.querySelector("#address").value.trim();
    const phone = modal.querySelector("#phone").value.trim();
    const cardNumber = modal.querySelector("#card-number").value.trim();
    const expiry = modal.querySelector("#expiry").value.trim();
    const cvv = modal.querySelector("#cvv").value.trim();
    if (!fullName || fullName.split(" ").length < 2) {
        showError(modal, "error-full-name", "Please enter your full name (first and last)");
        isValid = false;
    }
    if (!address || address.length < 10) {
        showError(modal, "error-address", "Please enter a complete address");
        isValid = false;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone || phoneDigits.length !== 10) {
        showError(modal, "error-phone", "Phone number must be 10 digits");
        isValid = false;
    }
    const cardDigits = cardNumber.replace(/\s/g, '');
    if (!cardNumber || cardDigits.length < 13 || cardDigits.length > 16) {
        showError(modal, "error-card-number", "Please enter a valid card number");
        isValid = false;
    }
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiry || !expiryRegex.test(expiry)) {
        showError(modal, "error-expiry", "Please enter expiry in MM/YY format");
        isValid = false;
    }
    if (!cvv || cvv.length !== 3) {
        showError(modal, "error-cvv", "CVV must be 3 digits");
        isValid = false;
    }
    if (!isValid) return;
    const last4 = cardDigits.slice(-4);
    const orderItems = JSON.parse(JSON.stringify(cart));
    const orderTotal = getCartTotal();
    cart = [];
    updateCartCount();
    modal.remove();
    showOrderSuccess(orderItems, orderTotal, last4);
}
function showError(modal, errorId, message) {
    const el = modal.querySelector(`#${errorId}`);
    if (el) {
        el.textContent = message;
        el.style.color = "red";
        el.style.fontSize = "13px";
        el.style.marginTop = "4px";
    }
}
function clearErrors(modal) {
    modal.querySelectorAll(".error-message").forEach(el => el.textContent = "");
}
// ==================== Success Screen ====================
function showOrderSuccess(orderItems, orderTotal, last4) {
    const orderNumber = "PP-" + Math.floor(100000 + Math.random() * 900000);
    const successModal = document.createElement("div");
    successModal.className = "cart-modal";
    successModal.innerHTML = `
        <div class="modal-content" style="text-align: center; max-width: 500px;">
            <h2 style="color: #28a745;">Order Placed Successfully!</h2>
            <p style="font-size: 18px; margin: 10px 0 20px;">
                Thank you for your order!<br>
                <strong>Order #${orderNumber}</strong>
            </p>
            <div style="text-align: left; background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px;">Order Summary</h4>
                <div id="success-summary"></div>
                <div style="text-align: right; margin-top: 10px; font-weight: bold;">
                    Card: •••• •••• •••• ${last4}<br>
                    Total: $${orderTotal.toFixed(2)}
                </div>
            </div>
            <p style="margin-bottom: 25px; color: #555;">
                Your pizza will be ready soon.<br>
                You will receive a confirmation shortly.
            </p>
            <button onclick="closeCartModal(this)" style="background-color: #d32f2f; color: white; padding: 14px 32px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
                Back to Menu
            </button>
        </div>
    `;
    document.body.appendChild(successModal);
    populateSuccessSummary(successModal, orderItems);
}
function populateSuccessSummary(modal, orderItems) {
    const container = modal.querySelector("#success-summary");
    container.innerHTML = "";
    orderItems.forEach(item => {
        const qty = item.quantity || 1;
        const itemTotal = (item.price * qty).toFixed(2);
       
        const div = document.createElement("div");
        div.style.cssText = "display:flex;justify-content:space-between;margin-bottom:6px;";
       
        const span1 = document.createElement("span");
        span1.textContent = `${qty}× ${item.name}`;
       
        if (item.toppings && item.toppings.length > 0) {
            const toppingsSpan = document.createElement("span");
            toppingsSpan.style.color = "#666";
            toppingsSpan.textContent = ` (${item.toppings.join(", ")})`;
            span1.appendChild(toppingsSpan);
        }
       
        const span2 = document.createElement("span");
        span2.textContent = `$${itemTotal}`;
       
        div.appendChild(span1);
        div.appendChild(span2);
        container.appendChild(div);
    });
}
function closeCartModal(button) {
    button.closest(".cart-modal").remove();
}
window.onload = displayMenu;
