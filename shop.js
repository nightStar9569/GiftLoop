// Sample product data
const products = [
    {
        id: 1,
        name: "プレミアムチョコレートセット",
        description: "厳選された高級チョコレートの詰め合わせ",
        price: 2500,
        category: "food",
        icon: "fas fa-cookie-bite"
    },
    {
        id: 2,
        name: "アロマキャンドル",
        description: "リラックスタイムを演出する香り高いキャンドル",
        price: 1800,
        category: "home",
        icon: "fas fa-fire"
    },
    {
        id: 3,
        name: "スキンケアセット",
        description: "肌を美しく保つ高品質なスキンケア商品",
        price: 4500,
        category: "beauty",
        icon: "fas fa-spa"
    },
    {
        id: 4,
        name: "ワイヤレスイヤホン",
        description: "高音質で快適なワイヤレスイヤホン",
        price: 8500,
        category: "tech",
        icon: "fas fa-headphones"
    },
    {
        id: 5,
        name: "手編みマフラー",
        description: "温かくておしゃれな手編みマフラー",
        price: 3200,
        category: "fashion",
        icon: "fas fa-scarf"
    },
    {
        id: 6,
        name: "パズルゲーム",
        description: "頭脳を鍛える楽しいパズルゲーム",
        price: 1500,
        category: "hobby",
        icon: "fas fa-puzzle-piece"
    },
    {
        id: 7,
        name: "オーガニックティー",
        description: "体に優しいオーガニックティーのセット",
        price: 2800,
        category: "food",
        icon: "fas fa-mug-hot"
    },
    {
        id: 8,
        name: "デスクライト",
        description: "目に優しいLEDデスクライト",
        price: 3800,
        category: "home",
        icon: "fas fa-lightbulb"
    }
];

// Cart state
let cart = [];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');

// Filter elements
const priceFilter = document.getElementById('priceFilter');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    setupEventListeners();
    updateCartDisplay();
});

// Setup event listeners
function setupEventListeners() {
    // Cart toggle
    cartToggle.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    // Checkout
    checkoutBtn.addEventListener('click', checkout);
    
    // Filters
    priceFilter.addEventListener('change', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    sortFilter.addEventListener('change', filterProducts);
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
            cartSidebar.classList.remove('open');
        }
    });
}

// Display products
function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <i class="${product.icon}"></i>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">¥${product.price.toLocaleString()}</div>
            <button class="add-to-cart" data-product-id="${product.id}">
                カートに追加
            </button>
        </div>
    `;
    
    // Add to cart event
    const addButton = card.querySelector('.add-to-cart');
    addButton.addEventListener('click', () => addToCart(product));
    
    return card;
}

// Add to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${product.name}をカートに追加しました！`, 'success');
}

// Update cart display
function updateCartDisplay() {
    // Update cart items
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="${item.icon}"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">¥${item.price.toLocaleString()} × ${item.quantity}</div>
            </div>
            <button class="remove-item" data-product-id="${item.id}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Remove item event
        const removeButton = cartItem.querySelector('.remove-item');
        removeButton.addEventListener('click', () => removeFromCart(item.id));
        
        cartItems.appendChild(cartItem);
    });
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `¥${total.toLocaleString()}`;
    
    // Update cart count
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    showNotification('商品をカートから削除しました', 'info');
}

// Toggle cart
function toggleCart() {
    cartSidebar.classList.toggle('open');
}

// Filter products
function filterProducts() {
    let filteredProducts = [...products];
    
    // Price filter
    const priceValue = priceFilter.value;
    if (priceValue) {
        const maxPrice = parseInt(priceValue);
        if (maxPrice === 1000) {
            filteredProducts = filteredProducts.filter(p => p.price <= 1000);
        } else if (maxPrice === 3000) {
            filteredProducts = filteredProducts.filter(p => p.price > 1000 && p.price <= 3000);
        } else if (maxPrice === 5000) {
            filteredProducts = filteredProducts.filter(p => p.price > 3000 && p.price <= 5000);
        } else if (maxPrice === 10000) {
            filteredProducts = filteredProducts.filter(p => p.price > 5000 && p.price <= 10000);
        } else if (maxPrice === 10001) {
            filteredProducts = filteredProducts.filter(p => p.price > 10000);
        }
    }
    
    // Category filter
    const categoryValue = categoryFilter.value;
    if (categoryValue) {
        filteredProducts = filteredProducts.filter(p => p.category === categoryValue);
    }
    
    // Sort
    const sortValue = sortFilter.value;
    if (sortValue === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'new') {
        filteredProducts.sort((a, b) => b.id - a.id);
    }
    
    displayProducts(filteredProducts);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('カートが空です', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Simulate checkout process
    showNotification('購入処理中...', 'info');
    
    setTimeout(() => {
        showNotification('購入が完了しました！贈り物が川に流されます。', 'success');
        cart = [];
        updateCartDisplay();
        toggleCart();
    }, 2000);
}

// uses global showNotification from js/notify.js 