import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

function escapeHtml(str) {
  if(!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(to, subject, htmlContent, textContent = '') {
  try {
    const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER;
    const mailOptions = {
      from: `"CRUD-SPI" <${fromAddress}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo");
  }
}

export async function sendWelcomeEmail(email, name) {
  const safeName = escapeHtml(name);
  const frontUrl = (process.env.FRONT_URL || 'http://localhost:3000').replace(/\/$/, '');
  const loginUrl = `${frontUrl}/login`;
  const supportEmail = process.env.SUPPORT_EMAIL || process.env.SMTP_USER;

  const subject = "🎉 ¡Bienvenido a CRUD-SPI!";

  const textContent = [
    `${name}!`,
    '',
    'TE DAMOS LA BIENVENIDA A CRUD-SPI. TE CONFIRMAMOS QUE TU CUENTA HA SIDO REGISTRADA CON EXITO',
    '',
    `INICIA SESION AQUI: ${loginUrl}`,
    '',
    supportEmail
    ? `SI NECESITAS AYUDA, ENVIA UN CORREO A ${supportEmail}`
    : 'no responder a este correo',
    '',
    '© CRUD-SPI',    
  ] .join('\n');

  const htmlContent = `
    
  <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a CRUD-SPI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F9; font-family: Arial, Helvetica, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F4F6F9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #E2E8F0;">
          <tr>
            <td align="center" style="background-color: #1D3E6E; padding: 28px 24px;">
              <span style="font-size: 24px; font-weight: bold; color: #FFFFFF; letter-spacing: 1px;">
                CRUD-SPI
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px 24px 32px; background-color: #FFFFFF;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; line-height: 1.3; color: #0F172A;">
                ¡Hola, ${safeName}!
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Te damos la bienvenida a <strong>CRUD-SPI</strong>. Tu cuenta ha sido creada exitosamente y ya puedes acceder al sistema.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px auto 28px auto;">
                <tr>
                  <td align="center" bgcolor="#1D3E6E" style="border-radius: 6px; background-color: #1D3E6E;">
                    <a href="${loginUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: bold; color: #FFFFFF; text-decoration: none; border-radius: 6px;">
                      Iniciar sesión
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #64748B;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
                <a href="${loginUrl}" style="color: #1D3E6E; word-break: break-all;">${loginUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 13px; line-height: 1.5; color: #64748B;">
                ${
                  supportEmail
                    ? `¿Necesitas ayuda? Contáctanos en <a href="mailto:${escapeHtml(supportEmail)}" style="color: #1D3E6E; text-decoration: underline;">${escapeHtml(supportEmail)}</a>.`
                    : 'Este es un mensaje automático, por favor no respondas a este correo.'
                }
              </p>
              <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                &copy; ${new Date().getFullYear()} CRUD-SPI. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendMail(email, subject, htmlContent);
}
