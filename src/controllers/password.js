import crypto from "crypto";
import {Op} from "sequelize";
import usersCrud from "../models/users.js";
import { encryptPassword } from "../utils/password.js";
import { sendPaswordReserEmail } from "../utils/sendEmail.js";

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;

        if(!email) {
            return res.status(400).json({error: "EL CORREO ES INCORRECTO O INEXISTENTE"})
        }
        const mensajeGenerico = {
            message: "RECIBIRAS UN ENLACE EN TU CORREO ELECTRONICO"
        };
        const user = await usersCrud.findOne({ where: {email: email.trim()}});
        if (!user){
            return res.status(200).json(mensajeGenerico);
            }
        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = hashToken(rawToken);
        const expiresAt = new Date(Date.now() + 30 *60 * 1000);

        await user.update({
            resetToken: hashedToken,
            resetTokenExpiresAt: expiresAt,
        });

        const frontUrl = (process.env.FRONT_URL || "http://localhost:3000").replace(/\/$/, "");
        const resetUrl = `${frontUrl}/restablecer/${rawToken}`;

        try {
            await sendPaswordReserEmail(user.email, user.name, resetUrl);
        } catch (mailError){
            console.error("ERROR AL ENVIAR CORREO DE RECUPERACION", mailError);
        }
        return res.status(200).json(mensajeGenerico);
    }catch (error) {
            console.error("Error en forgotPassword:", error);
            return res.status(500).json({ error: "ERROR DE SOLICITUD"});
        }
}; 

export const resetPassword = async (req, res) => {
    try{
        const { token, password } = req.body;

        if(!token || !password){
            return res.status(400).json({ error: "LA NUEVA CONTRASEÑA ES OBLIGATORIA"});
        }
        if (password.length < 6){
            return res.status(400).json({error: "LA CONTRASEÑA DEBE DE TENER ALMENOS 6 CARACTERES"});
        }

        const hashedToken = hashToken(token);
        const user = await usersCrud.findOne({
            where: {
                resetToken: hashedToken,
                resetTokenExpiresAt:{
                    [Op.gt]: new Date(),
                },
            },
        });

        if (!user){
            return res.status(400).json({
                error: "EL ENLACE ES INVALIDO O HA EXPIRADO"
            });
        }

        const hashedPassword = await encryptPassword(password);

        await user.update({
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiresAt: null,
        });

        return res.status(200).json({ message: "LA CONTRASEÑA SE RESTABLECIO CORRECTAMENTE"});

    } catch (error){
        console.error("Error en resetPassword:", error);
        return res.status(500).json({ error: "ERROR AL RESTABLECER LA CONTRASEÑA"});
    }
};