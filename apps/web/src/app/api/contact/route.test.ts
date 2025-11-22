import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock do nodemailer no início
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(),
  },
}));

describe('API Route: /api/contact', () => {
  let mockSendMail: any;
  let mockTransporter: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Configurar mock do sendMail
    mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-id' });

    // Configurar mock do transporter
    mockTransporter = {
      sendMail: mockSendMail,
    };

    // Configurar o mock do nodemailer.createTransport
    const nodemailer = require('nodemailer');
    nodemailer.default.createTransport.mockReturnValue(mockTransporter);
  });

  it('deve enviar email com dados válidos', async () => {
    const mockRequest = {
      json: async () => ({
        name: 'João Silva',
        email: 'joao@example.com',
        subject: 'Projeto importante',
        message: 'Gostaria de discutir um novo projeto com você.',
      }),
    } as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ message: 'Email enviado com sucesso!' });

    // Verificar se sendMail foi chamado 2 vezes (email principal + confirmação)
    expect(mockSendMail).toHaveBeenCalledTimes(2);

    // Verificar o email principal
    expect(mockSendMail).toHaveBeenNthCalledWith(1, expect.objectContaining({
      from: expect.objectContaining({
        name: 'Portfolio - João Silva',
      }),
      to: process.env.EMAIL_TO,
      replyTo: 'joao@example.com',
      subject: '[Portfolio] Projeto importante',
      text: expect.stringContaining('João Silva'),
      html: expect.stringContaining('João Silva'),
    }));

    // Verificar o email de confirmação
    expect(mockSendMail).toHaveBeenNthCalledWith(2, expect.objectContaining({
      from: expect.objectContaining({
        name: 'Mateus Salgueiro - Portfolio',
      }),
      to: 'joao@example.com',
      subject: 'Confirmação: Sua mensagem foi recebida!',
      html: expect.stringContaining('Obrigado por entrar em contato'),
    }));
  });

  it('deve retornar erro 400 para dados inválidos', async () => {
    const mockRequest = {
      json: async () => ({
        name: 'Jo', // Nome muito curto
        email: 'email-invalido', // Email inválido
        subject: 'Test', // Assunto muito curto
        message: 'Curta', // Mensagem muito curta
      }),
    } as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error', 'Dados inválidos');
    expect(data).toHaveProperty('details');
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it('deve validar campos obrigatórios', async () => {
    const mockRequest = {
      json: async () => ({}), // Enviando objeto vazio
    } as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error', 'Dados inválidos');
    expect(data.details).toBeInstanceOf(Array);
    expect(data.details.length).toBeGreaterThan(0);
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it('deve validar formato de email', async () => {
    const mockRequest = {
      json: async () => ({
        name: 'João Silva',
        email: 'nao-e-um-email',
        subject: 'Assunto válido',
        message: 'Mensagem válida com mais de 10 caracteres',
      }),
    } as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error', 'Dados inválidos');
    expect(data.details).toContainEqual(
      expect.objectContaining({
        path: ['email'],
        message: 'Email inválido',
      })
    );
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it('deve validar comprimento mínimo dos campos', async () => {
    const mockRequest = {
      json: async () => ({
        name: 'AB', // Menos de 3 caracteres
        email: 'teste@example.com',
        subject: '1234', // Menos de 5 caracteres
        message: '123456789', // Menos de 10 caracteres
      }),
    } as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error', 'Dados inválidos');
    expect(data.details).toContainEqual(
      expect.objectContaining({
        path: ['name'],
        message: 'Nome deve ter pelo menos 3 caracteres',
      })
    );
    expect(data.details).toContainEqual(
      expect.objectContaining({
        path: ['subject'],
        message: 'Assunto deve ter pelo menos 5 caracteres',
      })
    );
    expect(data.details).toContainEqual(
      expect.objectContaining({
        path: ['message'],
        message: 'Mensagem deve ter pelo menos 10 caracteres',
      })
    );
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it('deve retornar erro 500 quando o envio de email falha', async () => {
    mockSendMail.mockRejectedValueOnce(new Error('Erro de conexão SMTP'));

    const mockRequest = {
      json: async () => ({
        name: 'João Silva',
        email: 'joao@example.com',
        subject: 'Projeto importante',
        message: 'Gostaria de discutir um novo projeto com você.',
      }),
    } as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error', 'Erro ao enviar email. Por favor, tente novamente.');
    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });

  it('deve sanitizar HTML na mensagem', async () => {
    const mockRequest = {
      json: async () => ({
        name: 'João Silva<script>alert("XSS")</script>',
        email: 'joao@example.com',
        subject: 'Teste de segurança',
        message: 'Mensagem com <script>alert("XSS")</script> código malicioso',
      }),
    } as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockSendMail).toHaveBeenCalledTimes(2);

    // Verificar que o HTML foi escapado corretamente
    const emailCall = mockSendMail.mock.calls[0][0];
    expect(emailCall.html).toContain('João Silva&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    expect(emailCall.html).not.toContain('<script>');
  });

  it('deve incluir informações de timestamp no email', async () => {
    const mockRequest = {
      json: async () => ({
        name: 'João Silva',
        email: 'joao@example.com',
        subject: 'Projeto importante',
        message: 'Gostaria de discutir um novo projeto com você.',
      }),
    } as NextRequest;

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
    expect(mockSendMail).toHaveBeenCalledTimes(2);

    const emailCall = mockSendMail.mock.calls[0][0];
    expect(emailCall.text).toContain('Enviado através do formulário de contato do portfolio');
    expect(emailCall.html).toContain('Enviado através do formulário de contato do portfolio');
  });

  it('deve lidar com erro de JSON inválido', async () => {
    const mockRequest = {
      json: async () => {
        throw new Error('Invalid JSON');
      },
    } as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error', 'Erro ao enviar email. Por favor, tente novamente.');
    expect(mockSendMail).not.toHaveBeenCalled();
  });
});