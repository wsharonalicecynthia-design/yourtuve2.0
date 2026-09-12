import express from "express";
import { login, updateprofile } from "../controllers/auth.js";

const router = express.Router();

// Login / Register
router.post("/login", login);

// Update Profile
router.put("/update-profile/:id", updateprofile);

export default router;