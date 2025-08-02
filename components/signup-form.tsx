"use client";

import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { IconBrandGoogle, IconUser, IconMail, IconLock, IconId } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const checkPasswordStrength = (password: string): { strength: number; message: string } => {
  let strength = 0;
  
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  let message = '';
  if (strength < 2) message = 'Weak';
  else if (strength < 4) message = 'Medium';
  else message = 'Strong';

  return { strength, message };
};

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const isOAuth = searchParams.get('oauth') === 'google';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    teacherId: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, message: '' });
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(checkPasswordStrength(formData.password));
    } else {
      setPasswordStrength({ strength: 0, message: '' });
    }
  }, [formData.password]);

  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.teacherId) {
      router.push('/');
      router.refresh(); 
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!isOAuth && passwordStrength.strength < 2) {
      setError('Please use a stronger password');
      return;
    }

    if (!isOAuth && !passwordMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      if (isOAuth) {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teacherId: formData.teacherId,
            email: searchParams.get('email'),
            oauthId: searchParams.get('oauthId'),
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          setError(data.message || 'Please check your information and try again');
          return;
        }

        await signIn('google', { 
          redirect: false,
          callbackUrl: '/'
        });
      } else {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            teacherId: formData.teacherId,
            password: formData.password,
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          setError(data.message || 'This Email address or Id is already registered');
          return;
        }

        const signInResult = await signIn('credentials', {
          identifier: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError('Failed to sign in after registration');
          return;
        }
      }
    } catch {
      setError('Unable to complete registration. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/signup?oauth=google" });
  };

  const getStrengthColor = () => {
    if (passwordStrength.strength < 2) return 'bg-red-500';
    if (passwordStrength.strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen pt-8 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 p-12 flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <IconUser className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">AutoGrade</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Join Us!
            </h2>
            
            <p className="text-lg mb-8 text-purple-100 leading-relaxed">
              Create an account to start using our AI-powered answer evaluation system.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center text-purple-100">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>AI-powered grading system</span>
              </div>
              <div className="flex items-center text-purple-100">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>Instant feedback and analytics</span>
              </div>
              <div className="flex items-center text-purple-100">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>Streamlined workflow</span>
              </div>
            </div>
            
            <div className="mt-12">
              <p className="text-sm text-purple-200">
                AutoGrade — Revolutionizing answer paper evaluation with AI
              </p>
            </div>
            
            <div className="mt-8">
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-200"
              >
                SIGN IN
              </button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isOAuth ? "Complete Your Registration" : "Create Account"}
              </h2>
              <p className="text-gray-600">
                {isOAuth ? "Just one more step to get started" : "Get started with your evaluator account"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-center">
                {error}
              </div>
            )}

            {!isOAuth && (
              <button
                onClick={handleGoogleSignIn}
                className="w-full mb-6 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                <IconBrandGoogle className="w-5 h-5 mr-3" />
                Continue with Google
              </button>
            )}

            {!isOAuth && (
              <div className="relative mb-6">
                
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isOAuth && (
                <>
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IconMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IconLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                    {formData.password && (
                      <div className="mt-2">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                            style={{ 
                              width: `${(passwordStrength.strength / 5) * 100}%`
                            }}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${
                          passwordStrength.strength < 2 ? 'text-red-500' : 
                          passwordStrength.strength < 4 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          Password Strength: {passwordStrength.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IconLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                    {formData.confirmPassword && !passwordMatch && (
                      <p className="text-xs mt-1 text-red-500">
                        Passwords do not match
                      </p>
                    )}
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher ID
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconId className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="teacherId"
                    type="text"
                    placeholder="Enter your Teacher ID"
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="pl-10 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 inline-block"></div>
                    Creating account...
                  </>
                ) : (
                  "SIGN UP"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}