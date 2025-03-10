"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOAuth = searchParams.get('oauth') === 'google';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    teacherId: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isOAuth) {
        // OAuth signup - only need teacherId
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teacherId: formData.teacherId,
            email: searchParams.get('email'), // This will be set by the OAuth callback
            oauthId: searchParams.get('oauthId'), // This will be set by the OAuth callback
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to register');
        }
      } else {
        // Manual signup
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

        if (!response.ok) {
          throw new Error('Failed to register');
        }
      }

      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/signup?oauth=google" });
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        {isOAuth ? "Complete Your Registration" : "Create an Account"}
      </h2>

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
      </form>
    </div>
  );
}
