import express from 'express';
import { registerController, loginController, updateUserController } from '../controllers/authController.js';

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.patch("/update-user", updateUserController);

export default router;