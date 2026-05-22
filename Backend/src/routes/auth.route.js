import express from "express";

const router = express.Router();

// Register route
router.get("/signup", (req, res) => {
    res.send("user registered successfully!");
})

// Login route
router.get("/login", (req, res) => {
    res.send("User logged in successfully!");
})

// Logout route
router.get("/logout", (req, res) => {
    res.send("User logged out successfully!");
})


export default router;