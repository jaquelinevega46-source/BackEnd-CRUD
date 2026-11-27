import { z } from 'zod';

const name = z
.string({required_error: "EL NOMBRE ES OBLIGATORIO"})
.trim()
.min(1, "El nombre es obligatorio")
.max(100, "Maximo 100 caracteres");

const email = z
.string({required_error: "EL CORREO ES OBLIGATORIO"})
.trim()
.min(1, "El correo es obligatorio")
.email("Ingresa un correo valido")
.max(100, "Maximo 100 caracteres");

const password = z
.string({required_error: "LA CONTRASEÑA ES OBLIGATORIA"})
.min(6, "La contraseña debe tener al menos 6 caracteres");

export const crearUsuarioSchema = z.object({
  name,
  email,
  password,
  role: z.enum(["admin", "user"]).optional(),
});

export const actualizarUsuarioSchema = z.object({
  name: name.optional(),
  email: email.optional(),
  password: z.union([z.literal(""), password]).optional(),
});