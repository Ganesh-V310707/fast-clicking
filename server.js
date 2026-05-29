require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

let requests = [];

// Create payment request
app.post("/request-payment", (req, res) => {

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Name Required"
        });
    }

    const player = {
        id: uuidv4(),
        name,
        approved: false
    };

    requests.push(player);

    res.json(player);
});

// Get all requests
app.get("/requests", (req, res) => {

    res.json(requests);

});

// Approve request
app.post("/approve/:id", (req, res) => {

    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            success: false,
            message: "Password Required"
        });
    }

    if (password !== process.env.ADMIN_PASSWORD) {

        return res.status(401).json({
            success: false,
            message: "Wrong Password"
        });

    }

    const player = requests.find(
        p => p.id === req.params.id
    );

    if (!player) {

        return res.status(404).json({
            success: false,
            message: "Player Not Found"
        });

    }

    player.approved = true;

    res.json({
        success: true,
        message: "Player Approved"
    });

});

// Check status
app.get("/status/:id", (req, res) => {

    const player = requests.find(
        p => p.id === req.params.id
    );

    if (!player) {

        return res.json({
            approved: false
        });

    }

    res.json({
        approved: player.approved
    });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server Running On Port ${PORT}`
    );

});