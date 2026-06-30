import express from "express";
// 🎯 FIX: Added updateprofile to the import statement
import { login, updateprofile } from "../controllers/auth.js"; 

const router = express.Router();

// http://localhost:5000/user/login
router.post("/login", login);

// 🎯 FIX: Added the PUT route for updating the profile/creating a channel
// http://localhost:5000/user/update-profile/:id
router.put("/update-profile/:id", updateprofile); 

export default router;