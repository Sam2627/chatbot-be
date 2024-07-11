const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // Get all NguoiHoi records
  router.get("/", (req, res) => {
    const query = "SELECT * FROM NguoiHoi";
    try {
      const results = db.prepare(query).all();
      res.send(results);
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  // Get a specific NguoiHoi by ID
  router.get("/:NguoiHoiid", (req, res) => {
    const NguoiHoiid = req.params.NguoiHoiid;
    const query = "SELECT * FROM NguoiHoi WHERE NguoiHoiid = ?";
    try {
      const result = db.prepare(query).get(NguoiHoiid);
      if (!result) {
        res.status(404).send("Nguoi Hoi khong ton tai");
      } else {
        res.send(result);
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  // Create a new NguoiHoi record
  router.post("/", (req, res) => {
    const { CauHoiId, EmailNguoiHoi } = req.body;
    const query = "INSERT INTO NguoiHoi (CauHoiId, EmailNguoiHoi) VALUES (?, ?)";
    try {
      db.prepare(query).run(CauHoiId, EmailNguoiHoi);
      res.send("Tao Nguoi Hoi thanh cong");
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  // Update a specific NguoiHoi by ID
  router.put("/:NguoiHoiid", (req, res) => {
    const NguoiHoiid = req.params.NguoiHoiid;
    const { CauHoiId, EmailNguoiHoi } = req.body;
    const query = "UPDATE NguoiHoi SET CauHoiId = ?, EmailNguoiHoi = ? WHERE NguoiHoiid = ?";
    try {
      const result = db.prepare(query).run(CauHoiId, EmailNguoiHoi, NguoiHoiid);
      if (result.changes === 0) {
        res.status(404).send("Nguoi Hoi khong ton tai");
      } else {
        res.send("Cap nhat Nguoi Hoi thanh cong");
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  // Delete a specific NguoiHoi by ID
  router.delete("/:NguoiHoiid", (req, res) => {
    const NguoiHoiid = req.params.NguoiHoiid;
    const query = "DELETE FROM NguoiHoi WHERE NguoiHoiid = ?";
    try {
      const result = db.prepare(query).run(NguoiHoiid);
      if (result.changes === 0) {
        res.status(404).send("Nguoi Hoi khong ton tai");
      } else {
        res.send("Xoa Nguoi Hoi thanh cong");
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  return router;
};
