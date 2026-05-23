import express from "express";
import { signup , signin } from "../controllers/auth.controller.js";

const router = express.Router();

// Register route
router.post("/signup", signup);

// Login route
router.post("/login", signin);

// Logout route
router.post("/logout", (req, res) => {
    res.send("User logged out successfully!");
})


export default router;