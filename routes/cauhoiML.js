const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db'); // Import the shared database connection

// Function to execute a query
function executeQuery(query, params = []) {
  try {
    const stmt = db.prepare(query);
    return stmt.run(params);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Function to fetch data
function fetchData(query, params = []) {
  try {
    const stmt = db.prepare(query);
    return stmt.get(params);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Add row CauHoiML when thumb down
// API route for adding the latest question to CauHoiML and training the model
router.post('/cauhoiML', async (req, res) => {
  try {
    // Step 1: Get the most recent question from the CauHoi table
    const latestQuestionQuery = `
      SELECT MaCauHoi, CauHoi FROM CauHoi ORDER BY CauHoiId DESC LIMIT 1
    `;
    const latestQuestion = fetchData(latestQuestionQuery);

    if (!latestQuestion) {
      return res.status(404).json({ error: "No questions found in the CauHoi table" });
    }

    const { MaCauHoi, CauHoi } = latestQuestion;

    // Step 2: Check if the question (CauHoi) already exists in the CauHoiML table
    const existingQuestionQuery = `
      SELECT CauHoi FROM CauHoiML WHERE CauHoi = ?
    `;
    const existingQuestion = fetchData(existingQuestionQuery, [CauHoi]);

    if (existingQuestion) {
      return res.status(409).json({ error: "Question already exists in the CauHoiML table" });
    }

    // Step 3: Convert MaCauHoi to a JSON string format
    const maCauHoiJson = JSON.stringify([MaCauHoi]);

    // Step 4: Insert the latest question into the CauHoiML table
    const insertQuery = `
      INSERT INTO CauHoiML (MaCauHoi, CauHoi) VALUES (?, ?)
    `;
    executeQuery(insertQuery, [maCauHoiJson, CauHoi]);

    // Step 5: Call the Python API to train the model
    const response = await axios.get('http://localhost:5000/train');

    res.status(200).json({ message: "Latest question added and training complete", data: response.data });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
