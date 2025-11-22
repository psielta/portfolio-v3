import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from './page';

// Mock do fetch
global.fetch = vi.fn();

describe('ContactPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o formulário de contato', () => {
    render(<ContactPage />);

    expect(screen.getByText('Entre em Contato')).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assunto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensagem/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar mensagem/i })).toBeInTheDocument();
  });

  it('deve exibir erros de validação para campos vazios', async () => {
    const user = userEvent.setup();
    render(<ContactPage />);

    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/nome deve ter pelo menos 3 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/assunto deve ter pelo menos 5 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/mensagem deve ter pelo menos 10 caracteres/i)).toBeInTheDocument();
    });
  });

  it('deve validar email inválido', async () => {
    const user = userEvent.setup();
    render(<ContactPage />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'email-invalido');

    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('deve validar comprimento mínimo dos campos', async () => {
    const user = userEvent.setup();
    render(<ContactPage />);

    const nameInput = screen.getByLabelText(/nome completo/i);
    const subjectInput = screen.getByLabelText(/assunto/i);
    const messageInput = screen.getByLabelText(/mensagem/i);

    await user.type(nameInput, 'AB'); // Menos de 3 caracteres
    await user.type(subjectInput, 'Test'); // Menos de 5 caracteres
    await user.type(messageInput, 'Curta'); // Menos de 10 caracteres

    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/nome deve ter pelo menos 3 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/assunto deve ter pelo menos 5 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/mensagem deve ter pelo menos 10 caracteres/i)).toBeInTheDocument();
    });
  });

  it('deve enviar o formulário com dados válidos', async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Email enviado com sucesso!' }),
    });

    render(<ContactPage />);

    const nameInput = screen.getByLabelText(/nome completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const subjectInput = screen.getByLabelText(/assunto/i);
    const messageInput = screen.getByLabelText(/mensagem/i);

    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');
    await user.type(subjectInput, 'Projeto interessante');
    await user.type(messageInput, 'Gostaria de discutir um projeto muito interessante');

    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'João Silva',
          email: 'joao@example.com',
          subject: 'Projeto interessante',
          message: 'Gostaria de discutir um projeto muito interessante',
        }),
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/mensagem enviada com sucesso/i)).toBeInTheDocument();
    });
  });

  it('deve exibir erro quando o envio falha', async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erro no servidor' }),
    });

    render(<ContactPage />);

    const nameInput = screen.getByLabelText(/nome completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const subjectInput = screen.getByLabelText(/assunto/i);
    const messageInput = screen.getByLabelText(/mensagem/i);

    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');
    await user.type(subjectInput, 'Projeto interessante');
    await user.type(messageInput, 'Gostaria de discutir um projeto muito interessante');

    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/erro no servidor/i)).toBeInTheDocument();
    });
  });

  it('deve mostrar o contador de caracteres da mensagem', async () => {
    const user = userEvent.setup();
    render(<ContactPage />);

    const messageInput = screen.getByLabelText(/mensagem/i);

    expect(screen.getByText('0/5000')).toBeInTheDocument();

    await user.type(messageInput, 'Teste de mensagem');

    expect(screen.getByText('17/5000')).toBeInTheDocument();
  });

  it('deve desabilitar o botão durante o envio', async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockImplementation(() =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({ message: 'Email enviado com sucesso!' }),
          });
        }, 100);
      })
    );

    render(<ContactPage />);

    const nameInput = screen.getByLabelText(/nome completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const subjectInput = screen.getByLabelText(/assunto/i);
    const messageInput = screen.getByLabelText(/mensagem/i);

    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');
    await user.type(subjectInput, 'Projeto interessante');
    await user.type(messageInput, 'Gostaria de discutir um projeto muito interessante');

    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
    await user.click(submitButton);

    expect(screen.getByText(/enviando.../i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText(/mensagem enviada com sucesso/i)).toBeInTheDocument();
    });
  });

  it('deve limpar o formulário após envio bem-sucedido', async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Email enviado com sucesso!' }),
    });

    render(<ContactPage />);

    const nameInput = screen.getByLabelText(/nome completo/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const subjectInput = screen.getByLabelText(/assunto/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/mensagem/i) as HTMLTextAreaElement;

    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');
    await user.type(subjectInput, 'Projeto interessante');
    await user.type(messageInput, 'Gostaria de discutir um projeto muito interessante');

    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/mensagem enviada com sucesso/i)).toBeInTheDocument();
    });

    // Aguardar um pouco para o formulário resetar
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(subjectInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });
  });

  it('deve renderizar links de contato rápido', () => {
    render(<ContactPage />);

    expect(screen.getByText('psielta@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('@psielta')).toBeInTheDocument();
    expect(screen.getByText('Mateus Salgueiro')).toBeInTheDocument();
  });

  it('deve exibir informações de localização', () => {
    render(<ContactPage />);

    expect(screen.getByText('São Sebastião do Paraíso - MG')).toBeInTheDocument();
    expect(screen.getByText('Brasil 🇧🇷')).toBeInTheDocument();
    expect(screen.getByText('GMT-3 (Brasília)')).toBeInTheDocument();
  });
});