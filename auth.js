// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const loginForm = document.querySelector('.login-form');
    const registerForm = document.querySelector('.register-form');

    // Tab switching functionality
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            this.classList.add('active');
            document.getElementById(`${targetTab}-form`).classList.add('active');
        });
    });

    // Password toggle functionality
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Login form handling
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('#login-email').value;
            const password = this.querySelector('#login-password').value;
            const remember = this.querySelector('input[name="remember"]').checked;
            
            // Simple validation
            if (!email || !password) {
                showNotification('メールアドレスとパスワードを入力してください。', 'error');
                return;
            }
            
            // Simulate login process
            showNotification('ログイン中...', 'info');
            
            // Simulate API call
            setTimeout(() => {
                // For demo purposes, accept any email/password combination
                const userData = {
                    id: generateUserId(),
                    email: email,
                    firstName: email.split('@')[0],
                    lastName: 'ユーザー',
                    birthDate: '1990-01-01',
                    joinDate: new Date().toISOString(),
                    membershipLevel: 'basic',
                    points: 100,
                    giftsReceived: 0,
                    giftsSent: 0,
                    isLoggedIn: true
                };
                
                // Store user data
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                
                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                showNotification('ログインに成功しました！', 'success');
                
                // Redirect to my page after a short delay
                setTimeout(() => {
                    window.location.href = 'mypage.html';
                }, 1500);
            }, 2000);
        });
    }

    // Register form handling
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = this.querySelector('#register-firstname').value;
            const lastName = this.querySelector('#register-lastname').value;
            const email = this.querySelector('#register-email').value;
            const password = this.querySelector('#register-password').value;
            const confirmPassword = this.querySelector('#register-confirm-password').value;
            const birthDate = this.querySelector('#register-birthdate').value;
            const terms = this.querySelector('input[name="terms"]').checked;
            const newsletter = this.querySelector('input[name="newsletter"]').checked;
            
            // Validation
            if (!firstName || !lastName || !email || !password || !confirmPassword || !birthDate) {
                showNotification('すべての必須項目を入力してください。', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('パスワードが一致しません。', 'error');
                return;
            }
            
            if (password.length < 8) {
                showNotification('パスワードは8文字以上で入力してください。', 'error');
                return;
            }
            
            if (!terms) {
                showNotification('利用規約に同意してください。', 'error');
                return;
            }
            
            // Simulate registration process
            showNotification('アカウントを作成中...', 'info');
            
            // Simulate API call
            setTimeout(() => {
                const userData = {
                    id: generateUserId(),
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    birthDate: birthDate,
                    joinDate: new Date().toISOString(),
                    membershipLevel: 'basic',
                    points: 100,
                    giftsReceived: 0,
                    giftsSent: 0,
                    newsletter: newsletter,
                    isLoggedIn: true
                };
                
                // Store user data
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                
                showNotification('アカウントが正常に作成されました！', 'success');
                
                // Redirect to my page after a short delay
                setTimeout(() => {
                    window.location.href = 'mypage.html';
                }, 1500);
            }, 2000);
        });
    }

    // Social login buttons
    document.querySelectorAll('.btn-social').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.classList.contains('btn-google') ? 'Google' : 'Facebook';
            showNotification(`${provider}でのログイン機能は現在開発中です。`, 'info');
        });
    });

    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('パスワードリセット機能は現在開発中です。', 'info');
        });
    }
});

// Generate a simple user ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // Redirect to my page if already logged in
        window.location.href = 'mypage.html';
    }
}

// Run login status check when page loads
checkLoginStatus(); 