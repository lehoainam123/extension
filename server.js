const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ KẾT NỐI MONGODB ATLAS (lấy từ biến môi trường)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ DB Error:", err));

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

// ✅ FIX PORT CHO RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server chạy port " + PORT);
});
