import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';

export const generatetokensandsetcookies = (userId, res) => {
    const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: '15d' });

    res.cookie('jwt-login', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, // prevents access from javascript, prevent XSS attacks
        sameSite: ENV_VARS.NODE_ENV === "development" ? "strict" : "none", // strict for localhost, none for cross-site (Render+Vercel)
        secure: ENV_VARS.NODE_ENV !== "development",
    });

    return token;
};
