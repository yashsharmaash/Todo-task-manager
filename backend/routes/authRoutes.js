import express from 'express';
const router = express.Router();
import {
    loginUser,
    registerUser,
} from '../controllers/authController.js';

import { check } from 'express-validator';

router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 8 characters, contain 1 uppercase, 1 lowercase and 1 number')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
], registerUser);
router.post('/login', loginUser);

export default router;
