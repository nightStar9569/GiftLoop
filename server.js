/**
 * Simple Test Server for Gift API
 * This is a basic server for testing the API endpoints
 * In production, you would use a proper backend framework
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const users = [];
const tokens = new Set();

// Helper function to generate user ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Helper function to create JWT token
function createToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

// Helper function to verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Middleware to check authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '認証が必要です。' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ message: '無効なトークンです。' });
    }

    req.userId = decoded.userId;
    next();
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Gift API is running' });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, birthDate } = req.body;

        // Validation
        if (!email || !password || !firstName || !lastName || !birthDate) {
            return res.status(400).json({ message: 'すべての必須項目を入力してください。' });
        }

        // Check if email already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'このメールアドレスは既に使用されています。' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: generateUserId(),
            email,
            firstName,
            lastName,
            birthDate,
            joinDate: new Date().toISOString(),
            membershipLevel: 'basic',
            points: 100,
            giftsReceived: 0,
            giftsSent: 0
        };

        // Store user (in production, save to database)
        users.push({
            ...user,
            password: hashedPassword
        });

        // Create token
        const token = createToken(user.id);

        res.status(201).json({
            message: 'アカウントが正常に作成されました！',
            user,
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'メールアドレスとパスワードを入力してください。' });
        }

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません。' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません。' });
        }

        // Create token
        const token = createToken(user.id);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'ログインに成功しました！',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// Logout endpoint
app.post('/api/auth/logout', authenticateToken, (req, res) => {
    try {
        // In a real application, you might want to blacklist the token
        tokens.add(req.headers['authorization'].split(' ')[1]);
        
        res.json({ message: 'ログアウトしました。' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// Forgot password endpoint
app.post('/api/auth/forgot-password', (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'メールアドレスを入力してください。' });
        }

        // Check if user exists
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(404).json({ message: 'このメールアドレスで登録されたユーザーが見つかりません。' });
        }

        // In production, send actual email with reset link
        console.log(`Password reset requested for: ${email}`);
        
        res.json({ message: 'パスワードリセット用のメールを送信しました。' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// Get user profile endpoint
app.get('/api/user/profile', authenticateToken, (req, res) => {
    try {
        const user = users.find(u => u.id === req.userId);
        if (!user) {
            return res.status(404).json({ message: 'ユーザーが見つかりません。' });
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.json(userWithoutPassword);

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// Update user profile endpoint
app.put('/api/user/profile', authenticateToken, (req, res) => {
    try {
        const { firstName, lastName, birthDate } = req.body;
        const userIndex = users.findIndex(u => u.id === req.userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'ユーザーが見つかりません。' });
        }

        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            firstName: firstName || users[userIndex].firstName,
            lastName: lastName || users[userIndex].lastName,
            birthDate: birthDate || users[userIndex].birthDate
        };

        // Remove password from response
        const { password: _, ...userWithoutPassword } = users[userIndex];

        res.json({
            message: 'プロフィールが更新されました。',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// Change password endpoint
app.post('/api/user/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userIndex = users.findIndex(u => u.id === req.userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'ユーザーが見つかりません。' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, users[userIndex].password);
        if (!isValidPassword) {
            return res.status(400).json({ message: '現在のパスワードが正しくありません。' });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        users[userIndex].password = hashedNewPassword;

        res.json({ message: 'パスワードが変更されました。' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Gift API server running on http://localhost:${PORT}`);
    console.log(`📝 API Documentation:`);
    console.log(`   POST /api/auth/register - Register new user`);
    console.log(`   POST /api/auth/login - Login user`);
    console.log(`   POST /api/auth/logout - Logout user`);
    console.log(`   POST /api/auth/forgot-password - Request password reset`);
    console.log(`   GET  /api/user/profile - Get user profile`);
    console.log(`   PUT  /api/user/profile - Update user profile`);
    console.log(`   POST /api/user/change-password - Change password`);
    console.log(`   GET  /api/health - Health check`);
});

module.exports = app;