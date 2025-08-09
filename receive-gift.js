// Receive Gift functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'auth.html';
        return;
    }

    // Show user menu and hide login button
    const userMenu = document.querySelector('.user-menu');
    const loginBtn = document.getElementById('login-btn');
    if (userMenu && userMenu.style.display === 'none') {
        userMenu.style.display = 'block';
    }
    if (loginBtn && loginBtn.style.display !== 'none') {
        loginBtn.style.display = 'none';
    }

    // Load gift data
    loadGiftData();
    
    // Initialize actions
    initializeActions();
    
    // Load similar gifts
    loadSimilarGifts();
});

// Load gift data from URL parameters or localStorage
function loadGiftData() {
    const urlParams = new URLSearchParams(window.location.search);
    const giftId = urlParams.get('giftId');
    
    if (giftId) {
        // Load gift from localStorage
        const gifts = JSON.parse(localStorage.getItem('gifts') || '[]');
        const gift = gifts.find(g => g.id === giftId);
        
        if (gift) {
            displayGift(gift);
        } else {
            // Gift not found, show error
            showNotification('贈り物が見つかりませんでした。', 'error');
            setTimeout(() => {
                window.location.href = 'river.html';
            }, 2000);
        }
    } else {
        // No gift ID provided, generate a sample gift
        const sampleGift = generateSampleGift();
        displayGift(sampleGift);
    }
}

// Display gift information
function displayGift(gift) {
    // Update gift icon
    const giftIcon = document.getElementById('giftIcon');
    if (giftIcon) {
        if (gift.isSuper) {
            giftIcon.className = 'fas fa-crown';
            giftIcon.style.color = '#ffd700';
        } else {
            giftIcon.className = 'fas fa-gift';
            giftIcon.style.color = '#e91e63';
        }
    }

    // Update gift information
    const giftName = document.getElementById('giftName');
    const giftDescription = document.getElementById('giftDescription');
    const giftPrice = document.getElementById('giftPrice');
    const giftCategory = document.getElementById('giftCategory');
    const giftSender = document.getElementById('giftSender');
    const giftDate = document.getElementById('giftDate');

    if (giftName) giftName.textContent = gift.name;
    if (giftDescription) giftDescription.textContent = gift.description;
    if (giftPrice) giftPrice.textContent = gift.price.toLocaleString();
    if (giftCategory) giftCategory.textContent = getCategoryText(gift.category);
    if (giftSender) giftSender.textContent = gift.senderName || '匿名';
    if (giftDate) giftDate.textContent = formatDate(gift.createdAt);

    // Show gift image if available
    if (gift.imageUrl) {
        const giftImageSection = document.getElementById('giftImageSection');
        const giftImage = document.getElementById('giftImage');
        if (giftImageSection && giftImage) {
            giftImage.src = gift.imageUrl;
            giftImageSection.style.display = 'block';
        }
    }

    // Store current gift for actions
    window.currentGift = gift;
}

// Generate sample gift for demonstration
function generateSampleGift() {
    const sampleGifts = [
        {
            id: 'sample_1',
            name: '高級チョコレートセット',
            category: 'food',
            price: 3000,
            description: 'ベルギー産の高級チョコレートセットです。様々な味わいをお楽しみいただけます。',
            imageUrl: null,
            isSuper: false,
            senderId: 'user_1',
            senderName: '田中太郎',
            createdAt: new Date().toISOString(),
            status: 'pending'
        },
        {
            id: 'sample_2',
            name: 'スーパープレゼント - 高級腕時計',
            category: 'fashion',
            price: 50000,
            description: 'スイス製の高級腕時計です。エレガントなデザインで、特別な日にお使いいただけます。',
            imageUrl: null,
            isSuper: true,
            senderId: 'user_2',
            senderName: '佐藤花子',
            createdAt: new Date().toISOString(),
            status: 'pending'
        }
    ];

    return sampleGifts[Math.floor(Math.random() * sampleGifts.length)];
}

// Get category text
function getCategoryText(category) {
    const categories = {
        'food': '食品・スイーツ',
        'fashion': 'ファッション',
        'beauty': '美容・コスメ',
        'electronics': '家電・電子機器',
        'books': '書籍・文具',
        'hobby': '趣味・スポーツ',
        'home': '生活用品',
        'other': 'その他'
    };
    return categories[category] || 'その他';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize gift actions
function initializeActions() {
    const acceptGift = document.getElementById('acceptGift');
    const rejectGift = document.getElementById('rejectGift');

    if (acceptGift) {
        acceptGift.addEventListener('click', handleAcceptGift);
    }

    if (rejectGift) {
        rejectGift.addEventListener('click', handleRejectGift);
    }
}

// Handle accept gift
function handleAcceptGift() {
    if (!window.currentGift) {
        showNotification('贈り物の情報が見つかりません。', 'error');
        return;
    }

    // Show loading
    showNotification('贈り物を受け取っています...', 'info');

    // Simulate API call
    setTimeout(() => {
        // Update gift status
        updateGiftStatus(window.currentGift.id, 'accepted');
        
        // Update user stats
        updateUserStats();
        
        // Show success message
        showNotification('贈り物を受け取りました！', 'success');
        
        // Redirect to mypage after a short delay
        setTimeout(() => {
            window.location.href = 'mypage.html';
        }, 2000);
    }, 1500);
}

// Handle reject gift
function handleRejectGift() {
    if (!window.currentGift) {
        showNotification('贈り物の情報が見つかりません。', 'error');
        return;
    }

    // Show confirmation
    if (confirm('この贈り物を拒否しますか？この操作は取り消せません。')) {
        // Show loading
        showNotification('贈り物を拒否しています...', 'info');

        // Simulate API call
        setTimeout(() => {
            // Update gift status
            updateGiftStatus(window.currentGift.id, 'rejected');
            
            // Show success message
            showNotification('贈り物を拒否しました。', 'info');
            
            // Redirect to river page after a short delay
            setTimeout(() => {
                window.location.href = 'river.html';
            }, 2000);
        }, 1000);
    }
}

// Update gift status
function updateGiftStatus(giftId, status) {
    const gifts = JSON.parse(localStorage.getItem('gifts') || '[]');
    const giftIndex = gifts.findIndex(g => g.id === giftId);
    
    if (giftIndex !== -1) {
        gifts[giftIndex].status = status;
        gifts[giftIndex].receivedAt = new Date().toISOString();
        localStorage.setItem('gifts', JSON.stringify(gifts));
    }
}

// Update user stats
function updateUserStats() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.giftsReceived = (userData.giftsReceived || 0) + 1;
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Load similar gifts
function loadSimilarGifts() {
    const similarGiftsGrid = document.getElementById('similarGiftsGrid');
    if (!similarGiftsGrid) return;

    // Get similar gifts from localStorage
    const gifts = JSON.parse(localStorage.getItem('gifts') || '[]');
    const currentGift = window.currentGift;
    
    if (!currentGift) return;

    // Filter similar gifts (same category, different gift)
    const similarGifts = gifts.filter(gift => 
        gift.category === currentGift.category && 
        gift.id !== currentGift.id &&
        gift.status === 'sent'
    ).slice(0, 3);

    // Display similar gifts
    similarGiftsGrid.innerHTML = '';
    
    if (similarGifts.length === 0) {
        similarGiftsGrid.innerHTML = `
            <div class="no-similar-gifts">
                <i class="fas fa-gift"></i>
                <p>似たような贈り物はありません</p>
            </div>
        `;
        return;
    }

    similarGifts.forEach(gift => {
        const giftCard = document.createElement('div');
        giftCard.className = 'similar-gift-card';
        giftCard.innerHTML = `
            <div class="similar-gift-icon">
                <i class="fas ${gift.isSuper ? 'fa-crown' : 'fa-gift'}"></i>
            </div>
            <div class="similar-gift-info">
                <h4>${gift.name}</h4>
                <p>¥${gift.price.toLocaleString()}</p>
            </div>
        `;
        
        giftCard.addEventListener('click', () => {
            window.location.href = `receive-gift.html?giftId=${gift.id}`;
        });
        
        similarGiftsGrid.appendChild(giftCard);
    });
}

// Show notification (if function exists)
function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#e91e63'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            font-weight: 600;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
} 