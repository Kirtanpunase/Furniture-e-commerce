document.addEventListener('DOMContentLoaded', function() {
    // Dropdown functionality
    const categoryLink = document.getElementById('category-link');
    const categoryDropdown = document.getElementById('category-dropdown');
    if (categoryLink && categoryDropdown) {
        categoryLink.addEventListener('click', function(e) {
            e.preventDefault();
            categoryDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!categoryLink.contains(e.target) && !categoryDropdown.contains(e.target)) {
                categoryDropdown.classList.remove('show');
            }
        });

        document.querySelectorAll('#category-dropdown a').forEach(function(item) {
            item.addEventListener('click', function() {
                categoryDropdown.classList.remove('show');
            });
        });
    }

    // Shop Now button scroll functionality
    const btn1 = document.getElementById('btn1');
    const productsDiv = document.getElementById('products');
    if (btn1 && productsDiv) {
        const shopBtn = btn1.querySelector('button');
        if (shopBtn) {
            shopBtn.addEventListener('click', function() {
                productsDiv.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    // Add to Cart functionality for all pages
    document.querySelectorAll('.add-cart-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const card = btn.closest('.product-card');
            if (!card) return;
            const product = {
                title: card.querySelector('.product-title')?.innerText || "",
                category: card.querySelector('.product-category')?.innerText || "",
                rating: card.querySelector('.product-rating')?.innerText || "",
                price: card.querySelector('.product-price')?.innerText || "",
                image: card.querySelector('img')?.getAttribute('src') || "",
                description: card.querySelector('p')?.innerText || ""
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));

            btn.innerText = "Added!";
            setTimeout(() => { btn.innerText = "Add to Cart"; }, 1000);
        });
    });
});