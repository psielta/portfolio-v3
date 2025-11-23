import { createEmailTransporter } from './transporter';
import { getPasswordResetEmailTemplate } from './templates';

export async function sendPasswordResetEmail(email: string, name: string, resetUrl: string) {
  const transporter = createEmailTransporter();

  const mailOptions = {
    from: {
      name: 'Portfolio - Mateus Salgueiro',
      address: process.env.EMAIL_USER!,
    },
    to: email,
    subject: '🔑 Redefinir sua senha - Portfolio',
    html: getPasswordResetEmailTemplate(name, resetUrl),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de reset de senha enviado para: ${email}`);
  } catch (error) {
    console.error('❌ Erro ao enviar email de reset de senha:', error);
    throw new Error('Falha ao enviar email de reset de senha');
  }
}
