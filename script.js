// script.js - With Price Updates

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

    menuItems.forEach(pizza => {
        const card = document.createElement("div");
        card.className = "pizza-card";
        card.innerHTML = `
            <img src="${pizza.image}" alt="${pizza.name}">
            <h3>${pizza.name}</h3>
            <p>${pizza.description}</p>
            <p><strong>$${pizza.price}</strong></p>
            <button onclick="showCustomization('${pizza.name}', ${pizza.price})">Customize & Add</button>
        `;
        container.appendChild(card);
    });
}

// Show customization with price updates
function showCustomization(name, basePrice) {
    const size = prompt("Choose size: Small, Medium, Large", "Medium");
    const crust = prompt("Choose crust: Regular, Thin, Stuffed", "Regular");

    let finalPrice = basePrice;
    if (size === "Small") finalPrice -= 2;
    if (size === "Large") finalPrice += 3;

    const toppingsInput = prompt("Add toppings (comma separated)", "");
    const toppings = toppingsInput ? toppingsInput.split(",").map(t => t.trim()) : [];

    const confirmAdd = confirm(`Add ${size} ${name} with ${crust} crust for $${finalPrice.toFixed(2)}?`);

    if (confirmAdd) {
        cart.push({ name: `${size} ${name} (${crust} crust)`, price: finalPrice });
        updateCartCount();
        alert("Added to cart!");
    }
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
        total += item.price;
    });

    message += `\nTotal: $${total.toFixed(2)}`;
    alert(message);
}

// Run when page loads
window.onload = displayMenu;
