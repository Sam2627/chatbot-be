const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db'); // Import the shared database connection

// Function to execute a query (INSERT, UPDATE, DELETE)
function executeQuery(query, params = []) {
  try {
    const stmt = db.prepare(query);
    return stmt.run(params);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Function to fetch data (SELECT)
function fetchData(query, params = []) {
  try {
    const stmt = db.prepare(query);
    return stmt.get(params);
  } catch (error) {
    throw new Error(error.message);
  }
}

// API route for adding the latest question to CauHoiML if valid
router.post('/cauhoiMLUp', async (req, res) => {
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

    // Step 2: Call the Python API to check the length of the question
    const lenTextResponse = await axios.post('http://localhost:5000/len_text', {
      text: CauHoi
    });

    if (!lenTextResponse.data) {
      return res.status(400).json({ error: "Câu hỏi quá ngắn hoặc quá dài! Vui lòng nhập lại." });
    }

    // Step 3: Check if the question (CauHoi) already exists in the CauHoiML table
    const existingQuestionQuery = `
      SELECT CauHoi FROM CauHoiML WHERE CauHoi = ?
    `;
    const existingQuestion = fetchData(existingQuestionQuery, [CauHoi]);

    if (existingQuestion) {
      return res.status(409).json({ error: "Question already exists in the CauHoiML table" });
    }

    // Step 4: Convert MaCauHoi to a JSON string format
    const maCauHoiJson = JSON.stringify([MaCauHoi]);

    // Step 5: Insert the latest question into the CauHoiML table
    const insertQuery = `
      INSERT INTO CauHoiML (MaCauHoi, CauHoi) VALUES (?, ?)
    `;
    executeQuery(insertQuery, [maCauHoiJson, CauHoi]);

    // Step 6: Call the Python API to train the model
    await axios.get('http://localhost:8000/train');

    res.status(200).json({ message: "Latest question added and model training started successfully" });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
