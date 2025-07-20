document.addEventListener('DOMContentLoaded', function() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartSummaryDiv = document.getElementById('cart-summary');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to render cart items
    function renderCartItems() {
        // Convert cart array to a map by product title, accumulating quantity
        const cartMap = {};
        cart.forEach(product => {
            const key = product.title; // Using title as unique key. A true product ID would be better.
            if (!cartMap[key]) {
                cartMap[key] = { ...product, quantity: 1 };
            } else {
                cartMap[key].quantity += 1;
            }
        });

        const cartArr = Object.values(cartMap);

        if (cartArr.length === 0) {
            cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
            cartSummaryDiv.innerHTML = "";
            return;
        }

        cartItemsDiv.innerHTML = cartArr.map((product, index) => {
            // Find the original index of the product in the 'cart' array to use for removal
            // This is a simplification; ideally, you'd use a unique product ID.
            const originalIndex = cart.findIndex(item => item.title === product.title);

            return `
                <div class="cart-product-card" data-product-title="${product.title}">
                    <img src="${product.image}" alt="${product.title}" style="height:80px;width:auto;border-radius:6px;margin-right:16px;">
                    <div>
                        <div><strong>${product.title}</strong></div>
                        <div>${product.price}</div>
                        <div class="quantity-controls">
                            <button class="quantity-minus" data-title="${product.title}">-</button>
                            <span class="quantity-display">${product.quantity}</span>
                            <button class="quantity-plus" data-title="${product.title}">+</button>
                        </div>
                        <button class="remove-from-cart-btn" data-title="${product.title}">Remove</button>
                    </div>
                </div>
                <hr>
            `;
        }).join('');

        updateCartTotal();
        addEventListenersToCartButtons();
    }

    // Function to update the total price
    function updateCartTotal() {
        let total = 0;
        const cartMap = {};
        cart.forEach(product => {
            const key = product.title;
            if (!cartMap[key]) {
                cartMap[key] = { ...product, quantity: 1 };
            } else {
                cartMap[key].quantity += 1;
            }
        });
        const cartArr = Object.values(cartMap);

        cartArr.forEach(product => {
            const priceNum = Number(product.price.replace(/[^\d]/g, ''));
            total += priceNum * product.quantity;
        });

        cartSummaryDiv.innerHTML = `
            <div style="font-size:1.2em;margin:16px 0;">
                <strong>Total: ₹${total.toLocaleString()}</strong>
            </div>
            <button style="padding:10px 28px;background:#a67c52;color:#fff;border:none;border-radius:6px;font-size:1.1em;cursor:pointer;">Checkout</button>
        `;
    }

    // Function to add event listeners to dynamically created buttons
    function addEventListenersToCartButtons() {
        document.querySelectorAll('.quantity-minus').forEach(button => {
            button.addEventListener('click', function() {
                const title = this.dataset.title;
                updateQuantity(title, -1);
            });
        });

        document.querySelectorAll('.quantity-plus').forEach(button => {
            button.addEventListener('click', function() {
                const title = this.dataset.title;
                updateQuantity(title, 1);
            });
        });

        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const title = this.dataset.title;
                removeFromCart(title);
            });
        });
    }

    // Function to update product quantity
    function updateQuantity(productTitle, change) {
        // Find all instances of the product in the raw cart array
        let productIndices = [];
        cart.forEach((item, index) => {
            if (item.title === productTitle) {
                productIndices.push(index);
            }
        });

        if (change > 0) { // Increase quantity
            // Just add a new instance of the product
            const productToAdd = cart.find(item => item.title === productTitle);
            if (productToAdd) {
                cart.push(productToAdd);
            }
        } else if (change < 0) { // Decrease quantity
            if (productIndices.length > 0) {
                // Remove the last instance of the product
                cart.splice(productIndices[productIndices.length - 1], 1);
            }
        }
        saveCart();
        renderCartItems();
    }

    // Function to remove product from cart
    function removeFromCart(productTitle) {
        // Filter out all instances of the product to remove it completely
        cart = cart.filter(item => item.title !== productTitle);
        saveCart();
        renderCartItems();
    }

    // Initial render of cart items when the page loads
    renderCartItems();
});