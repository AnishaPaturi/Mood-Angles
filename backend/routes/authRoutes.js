import express from "express";
import { 
  registerUser, 
  loginUser, 
  registerPsychiatrist, 
  loginPsychiatrist 
} from "../controllers/authController.js";

const router = express.Router();

// User routes
router.post("/signup", registerUser);
router.post("/login", loginUser);

// Psychiatrist routes
router.post("/psychiatrist/signup", registerPsychiatrist);
router.post("/psychiatrist/login", loginPsychiatrist);

export default router;
