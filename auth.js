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
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = this.querySelector('#login-email').value;
            const password = this.querySelector('#login-password').value;
            const remember = this.querySelector('input[name="remember"]').checked;
            
            // Simple validation
            if (!email || !password) {
                showNotification('メールアドレスとパスワードを入力してください。', 'error');
                return;
            }
            
            // Check if giftApi is available
            if (typeof giftApi === 'undefined') {
                showNotification('APIサービスが利用できません。ページを再読み込みしてください。', 'error');
                return;
            }
            
            showNotification('ログイン中...', 'info');
            
            try {
                const { user, token } = await giftApi.login({ email, password });
                
                // Store user data and token
                localStorage.setItem('userData', JSON.stringify(user));
                localStorage.setItem('authToken', token);
                localStorage.setItem('isLoggedIn', 'true');
                
                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                showNotification('ログインに成功しました！', 'success');
                
                // Redirect to my page after a short delay
                setTimeout(() => {
                    window.location.href = 'mypage.html';
                }, 800);
            } catch (err) {
                showNotification(err.message || 'ログインに失敗しました。', 'error');
            }
        });
    }

    // Register form handling
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const firstName = this.querySelector('#register-firstname').value;
            const lastName = this.querySelector('#register-lastname').value;
            const email = this.querySelector('#register-email').value;
            const password = this.querySelector('#register-password').value;
            const confirmPassword = this.querySelector('#register-confirm-password').value;
            const birthDate = this.querySelector('#register-birthdate').value;
            const terms = this.querySelector('input[name="terms"]').checked;
            
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
            
            // Check if giftApi is available
            if (typeof giftApi === 'undefined') {
                showNotification('APIサービスが利用できません。ページを再読み込みしてください。', 'error');
                return;
            }
            
            showNotification('アカウントを作成中...', 'info');
            
            try {
                const { user, token } = await giftApi.register({
                    email,
                    password,
                    firstName,
                    lastName,
                    birthDate,
                });
                
                // Store user data and token
                localStorage.setItem('userData', JSON.stringify(user));
                localStorage.setItem('authToken', token);
                localStorage.setItem('isLoggedIn', 'true');
                
                showNotification('アカウントが正常に作成されました！', 'success');
                
                // Redirect to my page after a short delay
                setTimeout(() => {
                    window.location.href = 'mypage.html';
                }, 800);
            } catch (err) {
                showNotification(err.message || '登録に失敗しました。', 'error');
            }
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
        forgotPasswordLink.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const email = document.querySelector('#login-email').value;
            if (!email) {
                showNotification('メールアドレスを入力してください。', 'error');
                return;
            }
            
            if (typeof giftApi === 'undefined') {
                showNotification('APIサービスが利用できません。ページを再読み込みしてください。', 'error');
                return;
            }
            
            try {
                await giftApi.forgotPassword(email);
                showNotification('パスワードリセット用のメールを送信しました。メールボックスを確認してください。', 'success');
            } catch (err) {
                showNotification(err.message || 'パスワードリセットに失敗しました。', 'error');
            }
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