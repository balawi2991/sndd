import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mint-100 mb-4">
              <CheckCircle2 className="w-8 h-8 text-mint-600" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-600">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
          </div>

          <div className="enterprise-card p-8 text-center">
            <p className="text-sm text-gray-600 mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              variant="outline"
              className="w-full h-11 focus-calm"
            >
              Try another email
            </Button>
          </div>

          <div className="text-center mt-6">
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 text-sm font-medium text-mint-600 hover:text-mint-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-mint-400 to-mint-600 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Reset your password</h1>
          <p className="text-gray-600">Enter your email to receive reset instructions</p>
        </div>

        <div className="enterprise-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 focus-calm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-mint-600 hover:bg-mint-700 text-white font-medium transition-colors focus-calm"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 text-sm font-medium text-mint-600 hover:text-mint-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;