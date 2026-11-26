import express from 'express';
import { login } from '../controllers/login.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/api/login', login); 

router.get("/api/me", verificarToken, (req, res) => {
    return res.status(200).json({
        user: req.usuario,
        role: req.usuario.role,
    });
});

export default router;
