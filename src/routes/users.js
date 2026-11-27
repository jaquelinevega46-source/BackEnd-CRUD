import express from 'express';
import {
  createUser,
  updateUser,
  deleteUser,
  getUsers
} from '../controllers/users.js';
import { verificarToken, tokenOpcional, soloAdmin } from '../middlewares/auth.js';

// importando validarSchema
import { validarSchema } from '../middlewares/validarSchema.js';
import { crearUsuarioSchema, actualizarUsuarioSchema } from '../validators/userValidator.js';
const router = express.Router();

router.get('/', verificarToken, getUsers);
router.post('/', tokenOpcional, validarSchema(crearUsuarioSchema), createUser);
router.put('/:id', verificarToken, soloAdmin, updateUser);
router.delete('/:id', verificarToken, soloAdmin, deleteUser);

export default router;
