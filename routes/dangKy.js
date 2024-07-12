const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const { body, validationResult } = require('express-validator');
const db = require('../db'); // Ensure this points to your correct db file

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { user_name, email, password } = req.body;
      const saltRounds = 10; 
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Prepare and run the insert statement
      const stmt = db.prepare('INSERT INTO NguoiDung (user_name, email, password_hash) VALUES (?, ?, ?)');
      const result = stmt.run(user_name, email, passwordHash);

      res.status(201).json({ message: 'User created successfully', user_id: result.lastInsertRowid });
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

module.exports = router;
