

let cart = [];

// Sample pizza data
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

// Display menu
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

// Show customization panel (clean version - no popups)
function showCustomizationPanel(index) {
    const pizza = menuItems[index];
    
    // Create a simple customization panel
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
    
    // Add panel below the menu
    const menuSection = document.querySelector("main");
    menuSection.appendChild(panel);
}

// Add customized pizza to cart
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
    
    cart.push({
        name: itemName,
        price: finalPrice,
        toppings: toppings
    });
    
    updateCartCount();
    alert(`${itemName} added to cart!`);
    
    // Remove the panel
    panel.remove();
}

// Update cart count
function updateCartCount() {
    const cartLink = document.querySelector('nav a[href="#"]');
    if (cartLink) {
        cartLink.textContent = `Cart (${cart.length})`;
    }
}

// Show cart
function showCart() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "Items in your cart:\n\n";
    let total = 0;

    cart.forEach(item => {
        message += `${item.name} - $${item.price}\n`;
        if (item.toppings && item.toppings.length > 0) {
            message += `   Toppings: ${item.toppings.join(", ")}\n`;
        }
        total += item.price;
    });

    message += `\nTotal: $${total.toFixed(2)}`;
    alert(message);
}

// Run when page loads
window.onload = displayMenu;
