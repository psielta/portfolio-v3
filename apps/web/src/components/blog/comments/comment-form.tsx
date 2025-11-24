'use client';

import { motion } from 'framer-motion';
import { Loader2, Send, X } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Label } from '@/components/ui/label';

const commentSchema = Yup.object({
  content: Yup.string()
    .min(1, 'Comentário não pode estar vazio')
    .max(1000, 'Comentário muito longo (máximo 1000 caracteres)')
    .required('Comentário é obrigatório'),
});

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  isReply?: boolean;
}

export default function CommentForm({
  onSubmit,
  onCancel,
  initialValue = '',
  placeholder = 'Escreva seu comentário... (Markdown suportado)',
  submitLabel = 'Comentar',
  isReply = false,
}: CommentFormProps) {
  const handleSubmit = async (values: { content: string }, { setSubmitting, resetForm }: any) => {
    try {
      await onSubmit(values.content);
      resetForm();
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ content: initialValue }}
      validationSchema={commentSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ isSubmitting, values, errors, touched }) => (
        <Form className="space-y-3">
          <div>
            <div className="relative">
              <Field
                as="textarea"
                name="content"
                rows={isReply ? 3 : 4}
                className={`
                  w-full px-4 py-3 bg-white/10 border rounded-xl
                  text-white placeholder-white/40
                  backdrop-blur-sm resize-none
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  transition-all duration-300
                  ${errors.content && touched.content
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-white/20 hover:border-white/30'
                  }
                `}
                placeholder={placeholder}
              />
              <div className="absolute bottom-2 right-2 text-xs text-white/40">
                {values.content?.length || 0}/1000
              </div>
            </div>
            <ErrorMessage name="content">
              {(msg) => (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs mt-1"
                >
                  {msg}
                </motion.p>
              )}
            </ErrorMessage>
            <p className="text-white/40 text-xs mt-1">
              Suporte a **negrito**, *itálico*, [links](url) e mais
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="submit"
              disabled={isSubmitting || !values.content.trim()}
              whileHover={!isSubmitting && values.content.trim() ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting && values.content.trim() ? { scale: 0.98 } : {}}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white
                bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600
                hover:from-blue-600 hover:via-purple-700 hover:to-pink-700
                transition-all duration-300
                ${isSubmitting || !values.content.trim() ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {submitLabel}
                </>
              )}
            </motion.button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
