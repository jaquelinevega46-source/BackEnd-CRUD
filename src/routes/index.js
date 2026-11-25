import express from 'express';
import userRoutes from './users.js';    
import loginRoutes from './login.js';
import passwordRoutes from './Password.js';

const router = express.Router();

router.use('/api/users', userRoutes);  
router.use('/', loginRoutes);  

router.use('/api/password', passwordRoutes);

export { router };
