import { escapeHtml } from './transporter';

export function getVerificationEmailTemplate(name: string, verificationUrl: string): string {
  return `
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
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
            background: white;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 600;
            font-size: 16px;
          }
          .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
          .code-box {
            background: #f3f4f6;
            border: 2px dashed #9ca3af;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
            font-family: monospace;
            font-size: 24px;
            letter-spacing: 4px;
            color: #1f2937;
          }
          .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            color: #78350f;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Verifique seu Email</h1>
          </div>

          <div class="content">
            <p>Olá <strong>${escapeHtml(name)}</strong>,</p>
            <p>Obrigado por se cadastrar no meu portfolio! Para completar seu cadastro, precisamos verificar seu endereço de email.</p>

            <p>Clique no botão abaixo para verificar seu email:</p>

            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verificar Email</a>
            </div>

            <div class="warning">
              <strong>⚠️ Link de segurança:</strong> Este link expira em 24 horas por motivos de segurança.
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Se você não criou uma conta, pode ignorar este email com segurança.
            </p>
          </div>

          <div class="footer">
            <p style="margin: 5px 0;">Portfolio - Mateus Salgueiro</p>
            <p style="margin: 5px 0; color: #9ca3af;">Este é um email automático, por favor não responda.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getPasswordResetEmailTemplate(name: string, resetUrl: string): string {
  return `
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
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
            background: white;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 600;
            font-size: 16px;
          }
          .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
          .warning {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            color: #7f1d1d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Redefinir Senha</h1>
          </div>

          <div class="content">
            <p>Olá <strong>${escapeHtml(name)}</strong>,</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>

            <p>Clique no botão abaixo para criar uma nova senha:</p>

            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Redefinir Senha</a>
            </div>

            <div class="warning">
              <strong>⚠️ Link de segurança:</strong> Este link expira em 1 hora por motivos de segurança.
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Se você não solicitou a redefinição de senha, pode ignorar este email com segurança. Sua senha permanecerá inalterada.
            </p>
          </div>

          <div class="footer">
            <p style="margin: 5px 0;">Portfolio - Mateus Salgueiro</p>
            <p style="margin: 5px 0; color: #9ca3af;">Este é um email automático, por favor não responda.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getWelcomeEmailTemplate(name: string): string {
  return `
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
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
            background: white;
          }
          .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bem-vindo!</h1>
          </div>

          <div class="content">
            <p>Olá <strong>${escapeHtml(name)}</strong>,</p>
            <p>Seu email foi verificado com sucesso! Agora você pode acessar todos os recursos do portfolio.</p>

            <p>Obrigado por se juntar a nós!</p>

            <p>Atenciosamente,<br/><strong>Mateus Salgueiro</strong></p>
          </div>

          <div class="footer">
            <p style="margin: 5px 0;">Portfolio - Mateus Salgueiro</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
