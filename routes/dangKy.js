const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const { body, validationResult } = require('express-validator');

router.post('/users',
  [
    body('user_name')
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ], 
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { user_name, email, password } = req.body;
    // Hash the password
    const saltRounds = 10; // Adjust as needed for security
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user into the database
    const query = 'INSERT INTO NguoiDung (user_name, email, password_hash) VALUES (?, ?, ?)';
    const result = await db.query(query, [user_name, email, passwordHash]);

    res.status(201).json({ message: 'User created successfully', user_id: result.insertId }); 
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router; 