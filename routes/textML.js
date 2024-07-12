const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');

// Function to execute a query
function executeQuery(query, params) {
  try {
    const stmt = db.prepare(query);
    return stmt.all(params);
  } catch (error) {
    throw new Error(error.message);
  }
}

// API route for processing text
router.post('/processTextML', async (req, res) => {
  try {
    const { text } = req.body;

    // Step 1: Call the text_ml endpoint
    let response;
    try {
      response = await axios.post('http://localhost:5000/text_ml', { text, is_txt: true });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return res.status(400).json({ error: "Câu hỏi quá ngắn! Vui lòng nhập lại." });
      }
      throw error;
    }

    if (!response.data || response.data.length === 0) {
      throw new Error('ML API returned an empty list');
    }

    let stringList = response.data;
    const firstString = stringList.shift();

    // Step 3: Get MaVanBan and MaChuDe from the first string
    const firstStringQuery = `
      SELECT MaVanBan, MaChuDe FROM CauHoi WHERE MaCauHoi = ?
    `;
    const firstStringResult = executeQuery(firstStringQuery, [firstString]);

    if (firstStringResult.length === 0) {
      throw new Error('No matching record found for the first string');
    }

    const { MaVanBan, MaChuDe } = firstStringResult[0];

    // Additional Step: Fetch CauTraLoi from VanBanTraLoi
    const vanBanQuery = `
      SELECT CauTraLoi FROM VanBanTraLoi WHERE MaVanBan = ?
    `;
    const vanBanResult = executeQuery(vanBanQuery, [MaVanBan]);

    if (vanBanResult.length === 0) {
      throw new Error('No matching VanBan found');
    }

    const cauTraLoi = vanBanResult[0].CauTraLoi;

    // Step 4: Filter stringList based on MaChuDe and remove duplicates
    const filteredListQuery = `
      SELECT CauHoi FROM CauHoi WHERE MaChuDe = ? AND MaCauHoi != ?
    `;
    const filteredListResult = executeQuery(filteredListQuery, [MaChuDe, firstString]);

    const filteredList = filteredListResult.map(result => result.CauHoi);

    res.status(200).json({ CauTraLoi: cauTraLoi, Suggestions: [...new Set(filteredList)] }); // Remove duplicates using Set
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// API route for training the model
router.get('/train', async (req, res) => {
  try {
    // Call the Python API to train the model
    const response = await axios.get('http://localhost:5000/train');
    res.status(200).json({ message: "Training complete", data: response.data });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
