import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Loader2, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabase';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromQuery = params.get('email') || '';
    setEmail(emailFromQuery);
  }, [location.search]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = window.setInterval(() => setCooldownSeconds((prev) => (prev > 1 ? prev - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  async function sendCode() {
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { email },
      });

      if (error || !data?.success) {
        const cooldown = data?.cooldownSeconds;
        if (cooldown) setCooldownSeconds(cooldown);
        setError(error?.message || data?.error || 'Unable to send verification code');
        return;
      }

      setCooldownSeconds(60);
      setMessage('A new verification code has been sent.');
    } catch {
      setError('Unable to send verification code');
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyCode() {
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (code.trim().length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { email, verifyCode: code.trim() },
      });

      if (error || !data?.success) {
        setError(error?.message || data?.error || 'Verification failed');
        return;
      }

      const { error: updateError } = await supabase.from('users').update({ is_email_verified: true }).eq('email', email);
      if (updateError) {
        setError('The code was valid, but your account could not be updated.');
        return;
      }

      setMessage('Your email is verified. You can now sign in.');
      setTimeout(() => navigate('/login'), 1200);
    } catch {
      setError('Verification failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
          <p className="text-gray-600 mt-2">Enter your email and the 6-digit code sent by Resend.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <p className="text-sm text-green-700">{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="032xxxx@htu.edu.gh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification code</label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="123456"
            />
          </div>

          <button
            onClick={verifyCode}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-colors shadow-md"
          >
            {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Verifying...</span></> : <><span>Verify Code</span><ArrowRight className="w-5 h-5" /></>}
          </button>

          <button
            onClick={sendCode}
            disabled={isLoading || cooldownSeconds > 0}
            className="w-full text-sm text-blue-600 hover:text-blue-700 font-semibold disabled:text-gray-400"
          >
            {cooldownSeconds > 0 ? `Resend code in 00:${String(cooldownSeconds).padStart(2, '0')}` : 'Resend code'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-gray-600 hover:text-blue-700">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
