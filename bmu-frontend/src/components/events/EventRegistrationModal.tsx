import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2, CreditCard, ArrowLeft } from 'lucide-react';
import { useEventRegistration, useInitializePayment, useVerifyPayment } from '../../services/apiHooks';
import type { EventData } from '../../services/mockData';

interface RegistrationResult {
  id?: number;
  email?: string;
  payment_status?: string;
  payment_reference?: string;
  registration?: {
    id?: number;
    email?: string;
    payment_status?: string;
    payment_reference?: string;
  };
}

interface PaystackHandler {
  openIframe: () => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        access_code?: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => PaystackHandler;
    };
  }
}

interface Props {
  event: EventData;
  onClose: () => void;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
  EUR: '€',
};

const formatFee = (fee: number | null, currency: string): string => {
  if (!fee) return 'Free';
  const sym = CURRENCY_SYMBOLS[currency] || currency + ' ';
  return `${sym}${fee.toLocaleString()}`;
};

type Step = 'form' | 'payment' | 'processing' | 'success' | 'error';

export const EventRegistrationModal = ({ event, onClose }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [registrationResult, setRegistrationResult] = useState<RegistrationResult | null>(null);

  const freeRegistration = useEventRegistration();
  const initPayment = useInitializePayment();
  const verifyPayment = useVerifyPayment();

  const isPaid = !!event.fee && event.fee > 0;

  const loadPaystackScript = useCallback(() => {
    if (window.PaystackPop) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPaid) {
      setStep('payment');
    } else {
      setStep('processing');
      try {
        const result = await freeRegistration.mutateAsync({
          event_id: event.id,
          name,
          email,
          phone,
          institution,
        });
        setRegistrationResult(result);
        setStep('success');
      } catch {
        setErrorMsg('Registration failed. Please try again.');
        setStep('error');
      }
    }
  };

  const handlePayNow = async () => {
    setStep('processing');
    try {
      const initResult = await initPayment.mutateAsync({
        event_id: event.id,
        name,
        email,
        phone,
        institution,
      });

      const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

      if (publicKey && initResult.access_code && initResult.access_code !== 'demo_access_code') {
        await loadPaystackScript();
        const paystack = window.PaystackPop;
        if (!paystack) throw new Error('PaystackPop failed to load');
        const handler = paystack.setup({
          key: publicKey,
          email,
          amount: (event.fee || 0) * 100,
          currency: 'NGN',
          ref: initResult.reference,
          access_code: initResult.access_code,
          onClose: () => {
            setStep('payment');
          },
          callback: async (response: { reference: string }) => {
            setStep('processing');
            try {
              const verifyResult = await verifyPayment.mutateAsync(response.reference);
              setRegistrationResult(verifyResult);
              setStep('success');
            } catch {
              setErrorMsg('Payment verification failed. Please contact support.');
              setStep('error');
            }
          },
        });
        handler.openIframe();
      } else {
        const verifyResult = await verifyPayment.mutateAsync(initResult.reference);
        setRegistrationResult(verifyResult);
        setStep('success');
      }
    } catch {
      setErrorMsg('Payment initialization failed. Please try again.');
      setStep('error');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setInstitution('');
    setStep('form');
    setErrorMsg('');
    setRegistrationResult(null);
    freeRegistration.reset();
    initPayment.reset();
    verifyPayment.reset();
  };

  const renderForm = () => (
    <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
      <div>
        <label className="block text-small font-semibold text-gray-900 mb-1">Full Name *</label>
        <input
          type="text" required value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-small font-semibold text-gray-900 mb-1">Email *</label>
        <input
          type="email" required value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-small font-semibold text-gray-900 mb-1">Phone</label>
        <input
          type="tel" value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-small font-semibold text-gray-900 mb-1">Institution</label>
        <input
          type="text" value={institution}
          onChange={e => setInstitution(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
        />
      </div>
      {isPaid && (
        <div className="p-4 bg-amber-50 border border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-800">Registration Fee</span>
            <span className="text-lg font-bold text-amber-900">{formatFee(event.fee, event.currency)}</span>
          </div>
          <p className="text-xs text-amber-700 mt-1">You will be redirected to Paystack to complete payment.</p>
        </div>
      )}
      <div className="flex items-center gap-3 pt-4 border-t">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition"
        >
          {isPaid ? 'Continue to Payment' : 'Register Now'}
        </button>
        <button
          type="button" onClick={onClose}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  const renderPayment = () => (
    <div className="p-6 space-y-6">
      <div className="p-4 bg-gray-50 border space-y-3">
        <h3 className="font-semibold text-gray-900">Registration Summary</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium text-gray-900">Event:</span> {event.title}</p>
          <p><span className="font-medium text-gray-900">Name:</span> {name}</p>
          <p><span className="font-medium text-gray-900">Email:</span> {email}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-[#1E1E1E]">{formatFee(event.fee, event.currency)}</span>
        </div>
      </div>
      <button
        onClick={handlePayNow}
        disabled={initPayment.isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#1E1E1E]/90 transition disabled:opacity-60"
      >
        {initPayment.isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <CreditCard className="w-5 h-5" />
        )}
        {initPayment.isPending ? 'Initializing Payment...' : `Pay ${formatFee(event.fee, event.currency)} with Paystack`}
      </button>
      <button
        onClick={() => setStep('form')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Form
      </button>
    </div>
  );

  const renderProcessing = () => (
    <div className="p-12 text-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#1E1E1E] mx-auto mb-4" />
      <h3 className="text-title text-gray-900 mb-2">Processing...</h3>
      <p className="text-body text-gray-600">Please wait while we complete your registration.</p>
    </div>
  );

  const renderSuccess = () => {
    const data = registrationResult?.registration || registrationResult;
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-title text-gray-900 mb-2">Registration Confirmed</h3>
        <p className="text-body text-gray-600 mb-6">
          {isPaid
            ? 'Payment successful! A confirmation email with payment receipt has been sent.'
            : `You have been registered for this event. A confirmation email will be sent to ${data?.email || email}.`
          }
        </p>
        <div className="inline-block text-left p-4 bg-gray-50 border space-y-2 text-sm">
          {data?.id && (
            <p className="text-gray-500">
              Registration ID: <span className="font-mono font-medium text-gray-900">{data.id}</span>
            </p>
          )}
          {data?.payment_status === 'completed' && (
            <p className="text-gray-500">
              Payment: <span className="font-medium text-green-700">Completed</span>
            </p>
          )}
          {data?.payment_reference && (
            <p className="text-gray-500">
              Reference: <span className="font-mono font-medium text-gray-900">{data.payment_reference}</span>
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderError = () => (
    <div className="p-12 text-center">
      <div className="w-16 h-16 bg-red-100 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-title text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-body text-gray-600 mb-6">{errorMsg}</p>
      <button
        onClick={resetForm}
        className="px-6 py-2 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button type="button" aria-label="Close" className="absolute inset-0 bg-black/60" onClick={onClose} />
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl z-10"
        >
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-title text-gray-900">
                {step === 'success' ? 'Registration Complete' : 'Register for Event'}
              </h2>
              <p className="text-small text-gray-500 mt-1">{event.title}</p>
            </div>
            {step !== 'processing' && (
              <button onClick={onClose} className="p-2 hover:bg-gray-100 transition" aria-label="Close">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {step === 'form' && renderForm()}
          {step === 'payment' && renderPayment()}
          {step === 'processing' && renderProcessing()}
          {step === 'success' && renderSuccess()}
          {step === 'error' && renderError()}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventRegistrationModal;
