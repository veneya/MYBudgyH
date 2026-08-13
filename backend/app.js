const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        // Allow requests with no origin (e.g. curl, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, true);
    },
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Hey! Welcome to MyBudgyH server</h1>");
});

module.exports = app;
