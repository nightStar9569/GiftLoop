// Page-specific interactions for the landing page
// Keep only hero/demo/contact related logic; core nav/ripple/notifications moved to App.js and js/notify.js

document.addEventListener('DOMContentLoaded', function() {
    // ギフトループ demo interaction
    const giftItems = document.querySelectorAll('.gift-item');
    giftItems.forEach(item => {
        item.addEventListener('click', function() {
            const price = this.getAttribute('data-price');
            const isSuper = this.querySelector('.super');
            
            const iconClass = isSuper ? 'fa-crown' : 'fa-gift';
            const message = `¥${price}の贈り物を受け取りました！`;
            if (typeof showNotification === 'function') {
                showNotification(message, 'info');
            }
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const subject = this.querySelectorAll('input[type="text"]')[1]?.value || '';
            const message = this.querySelector('textarea').value;
            
            if (!name || !email || !subject || !message) {
                if (typeof showNotification === 'function') {
                    showNotification('すべての項目を入力してください。', 'error');
                }
                return;
            }
            
            if (typeof showNotification === 'function') {
                showNotification('お問い合わせを送信しました。ありがとうございます！', 'success');
            }
            this.reset();
        });
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const giftRiver = document.querySelector('.gift-river');
        
        if (hero && giftRiver) {
            const rate = scrolled * -0.5;
            giftRiver.style.transform = `translateY(${rate}px)`;
        }
    });
});

// Add floating animation delays to gift boxes in hero
function animateGiftBoxes() {
    const giftBoxes = document.querySelectorAll('.gift-box');
    giftBoxes.forEach((box, index) => {
        box.style.animationDelay = `${index * 2}s`;
    });
}

// Initialize animations after window load
window.addEventListener('load', function() {
    animateGiftBoxes();
    document.body.classList.add('loaded');
});

// Additional demo interactions and pricing counter

document.addEventListener('DOMContentLoaded', function() {
    // Hover effects for demo gift boxes
    const demoGiftBoxes = document.querySelectorAll('.gift-box-demo');
    demoGiftBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Counter animation for pricing
    const prices = document.querySelectorAll('.pricing-header .price');
    prices.forEach(price => {
        const finalValue = price.textContent;
        if (finalValue !== '¥0') {
            animateCounter(price, finalValue);
        }
    });
});

// Counter animation function (used only on pricing in landing page)
function animateCounter(element, finalValue) {
    const startValue = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const numeric = parseInt(finalValue.replace(/[^\d]/g, ''));
        const currentValue = Math.floor(startValue + (numeric - startValue) * progress);
        element.textContent = `¥${currentValue.toLocaleString()}`;
        if (progress < 1) requestAnimationFrame(updateCounter);
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(updateCounter);
                observer.unobserve(entry.target);
            }
        });
    });
    observer.observe(element);
} 