import express from 'express';
import { login } from '../controllers/login.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
    legacyHeaders: false,
  message: {
   error: 'Demasiados intentos. Vuelve a intentarlo en 15 minutos',
},
});

router.post('/api/login', login, loginLimiter); 


export default router;
