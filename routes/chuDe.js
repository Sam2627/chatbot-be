const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const query = "SELECT * FROM ChuDeCauHoi";
    try {
      const results = db.prepare(query).all();
      res.send(results);
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.get("/:MaChuDe", (req, res) => {
    const MaChuDe = req.params.MaChuDe;
    const query = "SELECT * FROM ChuDeCauHoi WHERE MaChuDe = ?";
    try {
      const result = db.prepare(query).get(MaChuDe);
      if (!result) {
        res.status(404).send("Chu de cau hoi khong ton tai");
      } else {
        res.send(result);
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.post("/", (req, res) => {
    const { MaChuDe, TenChuDe } = req.body;
    const query = "INSERT INTO ChuDeCauHoi (MaChuDe, TenChuDe) VALUES (?, ?)";
    try {
      db.prepare(query).run(MaChuDe, TenChuDe);
      res.send("Tao chu de cau hoi thanh cong");
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.put("/:MaChuDe", (req, res) => {
    const MaChuDe = req.params.MaChuDe;
    const { TenChuDe } = req.body;
    const query = "UPDATE ChuDeCauHoi SET TenChuDe = ? WHERE MaChuDe = ?";
    try {
      const result = db.prepare(query).run(TenChuDe, MaChuDe);
      if (result.changes === 0) {
        res.status(404).send("Chu de cau hoi khong ton tai");
      } else {
        res.send("Cap nhat chu de cau hoi thanh cong");
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.delete("/:MaChuDe", (req, res) => {
    const MaChuDe = req.params.MaChuDe;
    const query = "DELETE FROM ChuDeCauHoi WHERE MaChuDe = ?";
    try {
      const result = db.prepare(query).run(MaChuDe);
      if (result.changes === 0) {
        res.status(404).send("Chu de cau hoi khong ton tai");
      } else {
        res.send("Xoa chu de cau hoi thanh cong");
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  return router;
};
