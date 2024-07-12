require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const db = require('../db');

const secretKey = process.env.JWT_SECRET_KEY;

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        return res.status(403).json({ error: 'Token not provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token verification failed' });
        }
        req.user = decoded; // Store decoded token data in request object if needed
        next();
    });
}

// POST /api/verify-token endpoint
router.post('/verify-token', verifyToken, (req, res) => {
    // Token is valid, respond with success
    res.json({ message: 'Token verified successfully' });
});

// POST /api/logout endpoint
router.post('/logout', (req, res) => {
    // Clear any session-related data, such as clearing cookies or session information
    // Example: res.clearCookie('authToken'); // Clearing cookie
    res.json({ message: 'Logout successful' });
});

router.post('/login',
    [
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            // Retrieve user from the database
            const stmt = db.prepare('SELECT * FROM NguoiDung WHERE email = ?');
            const user = stmt.get(email);
            if (!user) {
                console.log('User not found for email:', email);
                return res.status(400).json({ error: 'Invalid email or password' });
            }
            // Compare password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                console.log('Incorrect password for user:', user.email);
                return res.status(400).json({ error: 'Invalid email or password' });
            }
            // Fetch user's role from the database
            const roleStmt = db.prepare('SELECT role FROM NguoiDung WHERE user_id = ?');
            const role = roleStmt.get(user.user_id);
            // Generate JWT token
            const token = jwt.sign(
                { userId: user.user_id, userRole: role.role },
                secretKey,
                { expiresIn: '1d' } // Token expires in 1 day
            );

            

            // Determine redirect URL based on role
            let redirectUrl = '/';
            if (role && role.role === 'user') {
                redirectUrl = '/index.html';
            } else if (role && role.role === 'admin') {
                redirectUrl = '/admin.html';
            } else if (role && role.role === 'department') {
                redirectUrl = '/department.html';
            }

            

            // Send the token and redirect URL to the client
            res.status(200).json({ message: 'Login successful', token, redirectUrl });

        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Failed to log in' });
        }
    }
);

module.exports = router;
