const express = require("express");
const router = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    const query = "SELECT * FROM CauHoi WHERE MaChuDe IS NULL OR MaDonVi IS NULL";
    try {
      const results = db.prepare(query).all();
      res.send(results);
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.get("/department", (req, res) => {
    const query = "SELECT * FROM CauHoi WHERE KhongTraLoi = 1";
    try {
      const results = db.prepare(query).all();
      res.send(results);
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.get("/departmentYES", (req, res) => {
    const query = "SELECT * FROM CauHoi WHERE CoTraLoi = 1 AND KhongTraLoi = 1";
    try {
      const results = db.prepare(query).all();
      res.send(results);
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.get("/departmentNO", (req, res) => {
    const query = "SELECT * FROM CauHoi WHERE CoTraLoi = 1 AND KhongTraLoi = 0";
    try {
      const results = db.prepare(query).all();
      res.send(results);
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.get("/:CauHoiId", (req, res) => {
    const CauHoiId = req.params.CauHoiId;
    const query = "SELECT * FROM CauHoi WHERE CauHoiId = ?";
    try {
      const result = db.prepare(query).get(CauHoiId);
      if (!result) {
        res.status(404).send("Cau hoi khong ton tai");
      } else {
        res.send(result);
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.post("/", (req, res) => {
    const {
      CauHoi,
      MaDonVi,
      MaChuDe,
      Email,
      ThoiGianHoi,
      CoThayDoi,
      KhongTraLoi,
    } = req.body;

    // Fetch the latest MaCauHoi and MaVanBan
    const getMaxValuesQuery = "SELECT MAX(CAST(SUBSTRING(MaCauHoi, 2) AS UNSIGNED)) AS maxCauHoi, MAX(CAST(SUBSTRING(MaVanBan, 3) AS UNSIGNED)) AS maxVanBan FROM CauHoi";

    try {
      const maxValues = db.prepare(getMaxValuesQuery).get();
      const maxCauHoi = maxValues.maxCauHoi || 0;
      const maxVanBan = maxValues.maxVanBan || 0;

      const newMaCauHoi = `C${maxCauHoi + 1}`;
      const newMaVanBan = `VB${maxVanBan + 1}`;

      const insertQuery =
        "INSERT INTO CauHoi (MaCauHoi, CauHoi, MaDonVi, MaChuDe, MaVanBan, Email, ThoiGianHoi, CoThayDoi, KhongTraLoi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      
      db.prepare(insertQuery).run(
        newMaCauHoi,
        CauHoi,
        MaDonVi,
        MaChuDe,
        newMaVanBan,
        Email,
        ThoiGianHoi,
        CoThayDoi,
        KhongTraLoi
      );

      res.status(201).json({ message: 'Câu hỏi của bạn đã được ghi nhận', MaCauHoi: newMaCauHoi, MaVanBan: newMaVanBan });
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.put("/:CauHoiId", (req, res) => {
    const CauHoiId = req.params.CauHoiId;
    const {
      CauHoi,
      MaDonVi,
      MaChuDe,
      Email,
      ThoiGianHoi,
      CoThayDoi,
      KhongTraLoi,
      CoTraLoi,
    } = req.body;
    const query =
      "UPDATE CauHoi SET CauHoi = ?, MaDonVi = ?, MaChuDe = ?, Email = ?, ThoiGianHoi = ?, CoThayDoi = ?, KhongTraLoi = ?, CoTraLoi = ? WHERE CauHoiId = ?";

    try {
      const result = db.prepare(query).run(
        CauHoi,
        MaDonVi,
        MaChuDe,
        Email,
        ThoiGianHoi,
        CoThayDoi,
        KhongTraLoi,
        CoTraLoi,
        CauHoiId
      );

      if (result.changes === 0) {
        res.status(404).send("Cau hoi khong ton tai");
      } else {
        res.send("Cap nhat cau hoi thanh cong");
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.put("/thuhoi/:CauHoiId", (req, res) => {
    const CauHoiId = req.params.CauHoiId;
    const {
      MaDonVi,
      MaChuDe,
      KhongTraLoi,
      CoTraLoi,
    } = req.body;
    const query =
      "UPDATE CauHoi SET MaDonVi = ?, MaChuDe = ?, KhongTraLoi = ?, CoTraLoi = ? WHERE CauHoiId = ?";

    try {
      const result = db.prepare(query).run(
        MaDonVi,
        MaChuDe,
        KhongTraLoi,
        CoTraLoi,
        CauHoiId
      );

      if (result.changes === 0) {
        res.status(404).send("Cau hoi khong ton tai");
      } else {
        res.send("Cap nhat cau hoi thanh cong");
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.put("/bophan/:CauHoiId", (req, res) => {
    const CauHoiId = req.params.CauHoiId;
    const { KhongTraLoi } = req.body;
    const query =
      "UPDATE CauHoi SET KhongTraLoi = ? WHERE CauHoiId = ?";

    try {
      const result = db.prepare(query).run(KhongTraLoi, CauHoiId);

      if (result.changes === 0) {
        res.status(404).send("Cau hoi khong ton tai");
      } else {
        res.send("Cap nhat cau hoi thanh cong");
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  router.delete("/:CauHoiId", (req, res) => {
    const CauHoiId = req.params.CauHoiId;
    const query = "DELETE FROM CauHoi WHERE CauHoiId = ?";

    try {
      const result = db.prepare(query).run(CauHoiId);

      if (result.changes === 0) {
        res.status(404).send("Cau hoi khong ton tai");
      } else {
        res.send("Xoa cau hoi thanh cong");
      }
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  });

  return router;
};
