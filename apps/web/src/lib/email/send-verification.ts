import { createEmailTransporter } from './transporter';
import { getVerificationEmailTemplate, getWelcomeEmailTemplate } from './templates';

export async function sendVerificationEmail(email: string, name: string, verificationUrl: string) {
  const transporter = createEmailTransporter();

  const mailOptions = {
    from: {
      name: 'Portfolio - Mateus Salgueiro',
      address: process.env.EMAIL_USER!,
    },
    to: email,
    subject: '🔐 Verifique seu email - Portfolio',
    html: getVerificationEmailTemplate(name, verificationUrl),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de verificação enviado para: ${email}`);
  } catch (error) {
    console.error('❌ Erro ao enviar email de verificação:', error);
    throw new Error('Falha ao enviar email de verificação');
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const transporter = createEmailTransporter();

  const mailOptions = {
    from: {
      name: 'Portfolio - Mateus Salgueiro',
      address: process.env.EMAIL_USER!,
    },
    to: email,
    subject: '🎉 Bem-vindo ao Portfolio!',
    html: getWelcomeEmailTemplate(name),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de boas-vindas enviado para: ${email}`);
  } catch (error) {
    console.error('❌ Erro ao enviar email de boas-vindas:', error);
    // Não lança erro, pois é apenas um email informativo
  }
}
