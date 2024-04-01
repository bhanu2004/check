import express, { raw } from "express";
import userController from "../controllers/user.js";
import checkUserAuth from "../middlewares/auth-middleware.js";
const router = express.Router();

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/update-account',checkUserAuth, userController.updateAccount);
router.post('/forget-password',userController.forgetPassword);
router.post('/reset-password/:id/:token', userController.resetPassword)

export default router;