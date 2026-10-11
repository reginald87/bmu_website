import { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import { useSubscribeNewsletter } from '../../services/apiHooks';

interface NewsletterFormProps {
  variant?: 'light' | 'dark';
  placeholder?: string;
  buttonLabel?: string;
  successMessage?: string;
  source?: string;
  className?: string;
}

export const NewsletterForm = ({
  variant = 'light',
  placeholder = 'Enter your email',
  buttonLabel = 'Subscribe',
  successMessage = 'Thanks for subscribing!',
  source = 'website',
  className = '',
}: NewsletterFormProps) => {
  const [email, setEmail] = useState('');
  const { mutate, isPending, isSuccess, isError } = useSubscribeNewsletter();
  const [errorMessage, setErrorMessage] = useState('');

  const isDark = variant === 'dark';
  const inputClass = isDark
    ? 'flex-1 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50'
    : 'flex-1 px-4 py-3 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600';
  const buttonClass = isDark
    ? 'px-6 py-3 font-semibold flex items-center justify-center gap-2 bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50'
    : 'px-6 py-3 font-semibold flex items-center justify-center gap-2 bg-ink-900 text-white hover:bg-ink-900/90 transition-colors disabled:opacity-50';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setErrorMessage('');
    mutate(
      { email: email.trim(), source },
      {
        onSuccess: () => setEmail(''),
        onError: (error) =>
          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to subscribe right now. Please try again.'
          ),
      }
    );
  };

  if (isSuccess) {
    return (
      <div className={`flex items-center justify-center gap-3 py-4 px-6 ${isDark ? 'bg-white/10' : 'bg-green-50'} ${className}`}>
        <CheckCircle className={`w-5 h-5 ${isDark ? 'text-white' : 'text-green-600'}`} />
        <span className={`font-medium ${isDark ? 'text-white' : 'text-green-700'}`}>{successMessage}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          required
          className={inputClass}
        />
        <button type="submit" disabled={isPending} className={buttonClass}>
          {isPending ? (
            <span className="w-5 h-5 border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">{buttonLabel}</span>
              <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
      {isError && errorMessage && (
        <p className={`mt-2 text-sm ${isDark ? 'text-red-200' : 'text-red-600'}`}>{errorMessage}</p>
      )}
    </form>
  );
};
