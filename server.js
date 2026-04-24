const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// CONNECT DB
mongoose.connect("mongodb://127.0.0.1:27017/meet");

// MODEL
const User = mongoose.model("User", {
    name: String,
    totalSessions: { type: Number, default: 0 },
    lastJoinDate: String
});

// API JOIN
app.post("/join", async (req, res) => {
    const { name } = req.body;
    const today = new Date().toISOString().slice(0, 10);

    let user = await User.findOne({ name });

    if (!user) {
        user = new User({
            name,
            totalSessions: 1,
            lastJoinDate: today
        });
    } else {
        if (user.lastJoinDate !== today) {
            user.totalSessions++;
            user.lastJoinDate = today;
        }
    }

    await user.save();
    res.json(user);
});

// API LIST
app.get("/list", async (req, res) => {
    const users = await User.find().sort({ totalSessions: -1 });
    res.json(users);
});

app.listen(3000, () => console.log("Server chạy: http://localhost:3000"));