import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Schema de validação
const contactSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

// Função para criar o transporter (facilita testes)
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// Função para escapar HTML
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };

  return text.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados
    const validatedData = contactSchema.parse(body);

    // Template HTML para o email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .header {
              background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 30px;
              background: white;
            }
            .field {
              margin-bottom: 25px;
            }
            .label {
              color: #6b7280;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 8px;
            }
            .value {
              color: #1f2937;
              font-size: 16px;
              padding: 12px;
              background: #f9fafb;
              border-radius: 8px;
              border-left: 3px solid #3b82f6;
            }
            .message-box {
              background: #f3f4f6;
              border-radius: 8px;
              padding: 20px;
              margin-top: 20px;
              border-left: 4px solid #9333ea;
            }
            .footer {
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
              color: white;
              border-radius: 20px;
              font-size: 12px;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 Nova Mensagem do Portfolio</h1>
              <div class="badge">Formulário de Contato</div>
            </div>

            <div class="content">
              <div class="field">
                <div class="label">👤 Nome</div>
                <div class="value">${escapeHtml(validatedData.name)}</div>
              </div>

              <div class="field">
                <div class="label">📧 Email</div>
                <div class="value">
                  <a href="mailto:${escapeHtml(validatedData.email)}" style="color: #3b82f6; text-decoration: none;">
                    ${escapeHtml(validatedData.email)}
                  </a>
                </div>
              </div>

              <div class="field">
                <div class="label">📋 Assunto</div>
                <div class="value">${escapeHtml(validatedData.subject)}</div>
              </div>

              <div class="message-box">
                <div class="label" style="margin-bottom: 12px;">💬 Mensagem</div>
                <div style="color: #1f2937; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(validatedData.message)}</div>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 5px 0;">Enviado através do formulário de contato do portfolio</p>
              <p style="margin: 5px 0; color: #9ca3af;">${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Configurações do email
    const mailOptions = {
      from: {
        name: `Portfolio - ${validatedData.name}`,
        address: process.env.EMAIL_USER!,
      },
      to: process.env.EMAIL_TO,
      replyTo: validatedData.email,
      subject: `[Portfolio] ${validatedData.subject}`,
      text: `
Nome: ${validatedData.name}
Email: ${validatedData.email}
Assunto: ${validatedData.subject}

Mensagem:
${validatedData.message}

---
Enviado através do formulário de contato do portfolio
${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
      `,
      html: htmlContent,
    };

    // Enviar email
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);

    // Enviar email de confirmação para o remetente
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #f3f4f6;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 30px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Mensagem Recebida!</h1>
            </div>
            <div class="content">
              <p>Olá <strong>${escapeHtml(validatedData.name)}</strong>,</p>
              <p>Obrigado por entrar em contato! Recebi sua mensagem e retornarei o mais breve possível.</p>
              <p style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong>Sua mensagem:</strong><br/>
                ${escapeHtml(validatedData.message)}
              </p>
              <p>Atenciosamente,<br/><strong>Mateus Salgueiro</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: {
        name: 'Mateus Salgueiro - Portfolio',
        address: process.env.EMAIL_USER!,
      },
      to: validatedData.email,
      subject: 'Confirmação: Sua mensagem foi recebida!',
      html: confirmationHtml,
    });

    return NextResponse.json(
      { message: 'Email enviado com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao enviar email:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao enviar email. Por favor, tente novamente.' },
      { status: 500 }
    );
  }
}