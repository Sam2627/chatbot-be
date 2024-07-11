const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // Get all VanBanTraLoi
  router.get("/", (req, res) => {
    const query = "SELECT * FROM VanBanTraLoi";
    try {
      const results = db.prepare(query).all();
      res.send(results);
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  // Get VanBanTraLoi by MaVanBanId
  router.get("/:MaVanBanId", (req, res) => {
    const MaVanBanId = req.params.MaVanBanId;
    const query = "SELECT * FROM VanBanTraLoi WHERE MaVanBanId = ?";
    try {
      const result = db.prepare(query).get(MaVanBanId);
      if (!result) {
        res.status(404).send("Van ban tra loi khong ton tai");
      } else {
        res.send(result);
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  // Get VanBanTraLoi by MaVanBan
  router.get("/department/:maVanBan", (req, res) => {
    const maVanBan = req.params.maVanBan;
    const query = "SELECT * FROM VanBanTraLoi WHERE MaVanBan = ?";
    try {
      const result = db.prepare(query).get(maVanBan);
      if (!result) {
        res.status(404).send("Van ban tra loi khong ton tai");
      } else {
        res.send(result);
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  // Create a new VanBanTraLoi
  router.post("/", (req, res) => {
    const { MaVanBan, CauTraLoi, MaDonVi, ThoiGianTraLoi } = req.body;
    const query = 
      "INSERT INTO VanBanTraLoi (MaVanBan, CauTraLoi, MaDonVi, ThoiGianTraLoi) VALUES (?, ?, ?, ?)";
    try {
      db.prepare(query).run(MaVanBan, CauTraLoi, MaDonVi, ThoiGianTraLoi);
      res.send("Tao van ban tra loi thanh cong");
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  // Update VanBanTraLoi by MaVanBan
  router.put("/department/:maVanBan", (req, res) => {
    const maVanBan = req.params.maVanBan;
    const { CauTraLoi, ThoiGianTraLoi } = req.body;
    const query = 
      "UPDATE VanBanTraLoi SET CauTraLoi = ?, ThoiGianTraLoi = ? WHERE MaVanBan = ?";
    try {
      const result = db.prepare(query).run(CauTraLoi, ThoiGianTraLoi, maVanBan);
      if (result.changes === 0) {
        res.status(404).json({ error: "Answer document not found" });
      } else {
        res.json({ message: "Answer document updated successfully" });
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  // Delete VanBanTraLoi by MaVanBanId
  router.delete("/:MaVanBanId", (req, res) => {
    const MaVanBanId = req.params.MaVanBanId;
    const query = "DELETE FROM VanBanTraLoi WHERE MaVanBanId = ?";
    try {
      const result = db.prepare(query).run(MaVanBanId);
      if (result.changes === 0) {
        res.status(404).send("Van ban tra loi khong ton tai");
      } else {
        res.send("Xoa van ban tra loi thanh cong");
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  return router;
};
