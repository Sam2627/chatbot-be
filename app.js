const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");

const db = require('./db'); // Import the shared database connection

const app = express();

app.use(cors());
app.use(express.json());

const donViRouter = require("./routes/donVi");
const chuDeCauHoiRouter = require("./routes/chuDe");
const vanBanTraLoiRouter = require("./routes/vanBanTraLoi");
const cauHoiRouter = require("./routes/cauHoi");
const nguoiHoiRouter = require("./routes/NguoiHoi");
const textMLRouter = require("./routes/textML");
const cauhoiMLRouter = require("./routes/cauhoiML");
const cauhoiMLupRouter = require('./routes/cauhoiMLup');
const dangKy = require('./routes/dangKy');

app.use("/api/donvi", donViRouter(db));
app.use("/api/chude", chuDeCauHoiRouter(db));
app.use("/api/vanbantraloi", vanBanTraLoiRouter(db));
app.use("/api/cauhoi", cauHoiRouter(db));
app.use("/api/nguoihoi", nguoiHoiRouter(db));
app.use(bodyParser.json());
app.use("/api", textMLRouter);
app.use('/api', cauhoiMLRouter);
app.use('/api', cauhoiMLupRouter);
app.use('/api', dangKy);

// Define host and port
  const host = '127.0.0.1';  // Thay đổi cái này theo ipv4 của máy
  const port = process.env.PORT || 3000;
  
  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
  