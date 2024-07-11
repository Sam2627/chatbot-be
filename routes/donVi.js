const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Get all DonVi records
  router.get("/", (req, res) => {
    const query = "SELECT * FROM DonVi";
    try {
      const results = db.prepare(query).all();
      res.send(results);
    } catch (err) {
      res.status(500).send("Error retrieving data");
    }
  });

  // Get a specific DonVi by ID
  router.get("/:MaDonVi", (req, res) => {
    const MaDonVi = req.params.MaDonVi;
    const query = "SELECT * FROM DonVi WHERE MaDonVi = ?";
    try {
      const result = db.prepare(query).get(MaDonVi);
      if (!result) {
        res.status(404).send("Don vi khong ton tai");
      } else {
        res.send(result);
      }
    } catch (err) {
      res.status(500).send("Error retrieving data");
    }
  });

  // Create a new DonVi record
  router.post("/", (req, res) => {
    const { MaDonVi, TenDonVi } = req.body;
    const query = "INSERT INTO DonVi (MaDonVi, TenDonVi) VALUES (?, ?)";
    try {
      db.prepare(query).run(MaDonVi, TenDonVi);
      res.send("Tao don vi thanh cong");
    } catch (err) {
      res.status(500).send("Error inserting data");
    }
  });

  // Update a specific DonVi by ID
  router.put("/:MaDonVi", (req, res) => {
    const MaDonVi = req.params.MaDonVi;
    const { TenDonVi } = req.body;
    const query = "UPDATE DonVi SET TenDonVi = ? WHERE MaDonVi = ?";
    try {
      const result = db.prepare(query).run(TenDonVi, MaDonVi);
      if (result.changes === 0) {
        res.status(404).send("Don vi khong ton tai");
      } else {
        res.send("Cap nhat don vi thanh cong");
      }
    } catch (err) {
      res.status(500).send("Error updating data");
    }
  });

  // Delete a specific DonVi by ID
  router.delete("/:MaDonVi", (req, res) => {
    const MaDonVi = req.params.MaDonVi;
    const query = "DELETE FROM DonVi WHERE MaDonVi = ?";
    try {
      const result = db.prepare(query).run(MaDonVi);
      if (result.changes === 0) {
        res.status(404).send("Don vi khong ton tai");
      } else {
        res.send("Xoa don vi thanh cong");
      }
    } catch (err) {
      res.status(500).send("Error deleting data");
    }
  });

  return router;
};
