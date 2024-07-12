require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');
const app = express();

// Middleware setup
app.use(cors({
    origin: 'http://127.0.0.1:5501',
    SameSite: 'Lax',
    credentials: true,
}));

app.use(express.json());

const secretKey = process.env.JWT_SECRET_KEY;

// Middleware to verify JWT tokens
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// Importing and setting up routes
const donViRouter = require("./routes/donVi");
const chuDeCauHoiRouter = require("./routes/chuDe");
const vanBanTraLoiRouter = require("./routes/vanBanTraLoi");
const cauHoiRouter = require("./routes/cauHoi");
const nguoiHoiRouter = require("./routes/NguoiHoi");
const textMLRouter = require("./routes/textML");
const cauhoiMLRouter = require("./routes/cauhoiML");
const cauhoiMLupRouter = require('./routes/cauhoiMLup');
const dangKyRouter = require('./routes/dangKy');
const dangNhapRouter = require('./routes/dangNhap');

// Routes setup
app.use("/api/donvi", donViRouter(db));
app.use("/api/chude", chuDeCauHoiRouter(db));
app.use("/api/vanbantraloi", vanBanTraLoiRouter(db));
app.use("/api/cauhoi", cauHoiRouter(db));
app.use("/api/nguoihoi", nguoiHoiRouter(db));
app.use("/api", textMLRouter);
app.use('/api', cauhoiMLRouter);
app.use('/api', cauhoiMLupRouter);
app.use('/api', dangKyRouter);
app.use('/api', dangNhapRouter);

// Server setup
const port = process.env.PORT || 4500;
const internalIp = process.env.INTERNAL_IP || '192.168.2.22';
const ipAddress = internalIp || '127.0.0.1';

app.listen(port, ipAddress, () => {
    console.log(`Server listening at http://${ipAddress}:${port}`);
});
