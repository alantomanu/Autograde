"use client";

import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
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
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white">
      <h2 className="font-bold text-xl text-neutral-800">
        {isOAuth ? "Complete Your Registration" : "Create an Account"}
      </h2>

      {error && (
        <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600">
          {error}
        </div>
      )}

      {!isOAuth && (
        <Button
          className="mt-4 w-full"
          type="button"
          onClick={handleGoogleSignIn}
          variant="outline"
        >
          <IconBrandGoogle className="mr-2" />
          Continue with Google
        </Button>
      )}

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-col gap-4">
          {!isOAuth && (
            <>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {formData.password && (
                  <div className="mt-1">
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ 
                          width: `${(passwordStrength.strength / 5) * 100}%`
                        }}
                      />
                    </div>
                    <p className={`text-xs mt-0.5 ${
                      passwordStrength.strength < 2 ? 'text-red-500' : 
                      passwordStrength.strength < 4 ? 'text-yellow-500' : 
                      'text-green-500'
                    }`}>
                      Password Strength: {passwordStrength.message}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                {formData.confirmPassword && !passwordMatch && (
                  <p className="text-xs mt-0.5 text-red-500">
                    Passwords do not match
                  </p>
                )}
              </div>
            </>
          )}
          
          <div>
            <Label htmlFor="teacherId">Teacher ID</Label>
            <Input
              id="teacherId"
              placeholder="Enter your Teacher ID"
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              required
            />
          </div>
        </div>

        <Button
          className="mt-4 w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
