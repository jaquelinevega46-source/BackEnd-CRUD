export const validarSchema = (schema) => (req, res, next) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      const errores = resultado.error.issues[0]?.message || "Datos invalidos en la peticion";
      return res.status(400).json({ error: errores });
    }
    req.body = resultado.data;
    next();
  }