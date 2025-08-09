// Send Gift functionality
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

    // Initialize form
    initializeForm();
    
    // Initialize preview
    initializePreview();
});

// Initialize form functionality
function initializeForm() {
    const form = document.getElementById('sendGiftForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Initialize preview functionality
function initializePreview() {
    const giftName = document.getElementById('giftName');
    const giftDescription = document.getElementById('giftDescription');
    const giftPrice = document.getElementById('giftPrice');
    const giftCategory = document.getElementById('giftCategory');
    const isSuper = document.getElementById('isSuper');

    // Update preview when form fields change
    if (giftName) {
        giftName.addEventListener('input', updatePreview);
    }
    if (giftDescription) {
        giftDescription.addEventListener('input', updatePreview);
    }
    if (giftPrice) {
        giftPrice.addEventListener('input', updatePreview);
    }
    if (giftCategory) {
        giftCategory.addEventListener('change', updatePreview);
    }
    if (isSuper) {
        isSuper.addEventListener('change', updatePreview);
    }
}

// Update preview
function updatePreview() {
    const giftName = document.getElementById('giftName').value || '贈り物の名前';
    const giftDescription = document.getElementById('giftDescription').value || '説明がここに表示されます';
    const giftPrice = document.getElementById('giftPrice').value || '0';
    const giftCategory = document.getElementById('giftCategory');
    const isSuper = document.getElementById('isSuper').checked;

    // Update preview elements
    const previewName = document.getElementById('previewName');
    const previewDescription = document.getElementById('previewDescription');
    const previewPrice = document.getElementById('previewPrice');
    const previewCategory = document.getElementById('previewCategory');
    const previewIcon = document.getElementById('previewIcon');

    if (previewName) previewName.textContent = giftName;
    if (previewDescription) previewDescription.textContent = giftDescription;
    if (previewPrice) previewPrice.textContent = giftPrice;
    
    // Update category
    if (previewCategory && giftCategory) {
        const categoryText = giftCategory.options[giftCategory.selectedIndex]?.text || 'カテゴリー';
        previewCategory.textContent = categoryText;
    }

    // Update icon for super gift
    if (previewIcon) {
        if (isSuper) {
            previewIcon.className = 'fas fa-crown';
            previewIcon.style.color = '#ffd700';
        } else {
            previewIcon.className = 'fas fa-gift';
            previewIcon.style.color = '#e91e63';
        }
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const giftData = {
        id: generateGiftId(),
        name: formData.get('giftName'),
        category: formData.get('giftCategory'),
        price: parseInt(formData.get('giftPrice')),
        description: formData.get('giftDescription'),
        imageUrl: formData.get('giftImage') || null,
        isSuper: formData.get('isSuper') === 'on',
        senderId: JSON.parse(localStorage.getItem('userData') || '{}').id,
        senderName: JSON.parse(localStorage.getItem('userData') || '{}').firstName,
        createdAt: new Date().toISOString(),
        status: 'sent'
    };

    // Validate form
    if (!validateGiftData(giftData)) {
        return;
    }

    // Show loading
    showNotification('贈り物を送信中...', 'info');

    // Simulate API call
    setTimeout(() => {
        // Save gift to localStorage (in a real app, this would be sent to a server)
        saveGiftToStorage(giftData);
        
        // Update user stats
        updateUserStats();
        
        // Show success message
        showNotification('贈り物が正常に送信されました！', 'success');
        
        // Redirect to river page after a short delay
        setTimeout(() => {
            window.location.href = 'river.html';
        }, 2000);
    }, 1500);
}

// Validate gift data
function validateGiftData(giftData) {
    if (!giftData.name || giftData.name.trim().length < 2) {
        showNotification('贈り物の名前を入力してください（2文字以上）', 'error');
        return false;
    }
    
    if (!giftData.category) {
        showNotification('カテゴリーを選択してください', 'error');
        return false;
    }
    
    if (!giftData.price || giftData.price < 100 || giftData.price > 100000) {
        showNotification('価格は100円から100,000円の間で入力してください', 'error');
        return false;
    }
    
    if (!giftData.description || giftData.description.trim().length < 10) {
        showNotification('説明を入力してください（10文字以上）', 'error');
        return false;
    }
    
    return true;
}

// Generate unique gift ID
function generateGiftId() {
    return 'gift_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Save gift to localStorage
function saveGiftToStorage(giftData) {
    const gifts = JSON.parse(localStorage.getItem('gifts') || '[]');
    gifts.push(giftData);
    localStorage.setItem('gifts', JSON.stringify(gifts));
}

// Update user stats
function updateUserStats() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.giftsSent = (userData.giftsSent || 0) + 1;
    localStorage.setItem('userData', JSON.stringify(userData));
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