"use client";

import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOAuth, setIsOAuth] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Check password strength
  const checkPasswordStrength = (pass: string) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;

    if (pass === "") return "";
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough]
      .filter(Boolean).length;

    if (strength < 2) return "Weak";
    if (strength < 4) return "Medium";
    return "Strong";
  };

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  // Handle manual signup
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isOAuth) {
      if (!email || !password || !teacherId || !confirmPassword) {
        alert("Please fill in all required fields.");
        return;
      }
      if (!passwordsMatch) {
        alert("Passwords do not match!");
        return;
      }
      if (passwordStrength !== "Strong") {
        alert("Please use a stronger password!");
        return;
      }
    }
    console.log("Signup Data:", { email, teacherId, password });
  };

  // Handle Google OAuth Signup
  const handleGoogleSignup = async () => {
    try {
      // Simulating OAuth authentication
      const oauthEmail = "user@gmail.com"; // Replace with actual OAuth response
      setEmail(oauthEmail);
      setIsOAuth(true);
      alert("Google OAuth successful! Enter your Teacher ID to complete signup.");
    } catch (error) {
      console.error("OAuth Signup Failed", error);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Sign Up
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        {isOAuth
          ? "Please enter your Teacher ID to complete signup."
          : "Create an account to continue."}
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* OAuth Button at the top */}
        <div className="flex flex-col space-y-4 mb-8">
          <button
            className="flex items-center space-x-2 justify-center w-full text-black rounded-md h-10 font-medium bg-gray-50 dark:bg-zinc-900"
            type="button"
            onClick={handleGoogleSignup}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-[1px] bg-neutral-300 dark:bg-neutral-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-black text-neutral-600 dark:text-neutral-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Email Field - Disabled for OAuth */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled={isOAuth}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@example.com"
          />
        </LabelInputContainer>

        {/* Teacher ID Field - Required for all */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="teacherId">Teacher ID</Label>
          <Input
            id="teacherId"
            type="text"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            placeholder="Enter your Teacher ID"
          />
        </LabelInputContainer>

        {/* Password Fields - Only for Manual Signup */}
        {!isOAuth && (
          <>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordStrength(checkPasswordStrength(e.target.value));
                }}
                placeholder="Enter The Password"
              />
              {password && (
                <div className={cn(
                  "text-sm",
                  passwordStrength === "Weak" && "text-red-500",
                  passwordStrength === "Medium" && "text-yellow-500",
                  passwordStrength === "Strong" && "text-green-500"
                )}>
                  Password Strength: {passwordStrength}
                </div>
              )}
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Your Password"
              />
              {confirmPassword && !passwordsMatch && (
                <div className="text-sm text-red-500">
                  Passwords do not match
                </div>
              )}
            </LabelInputContainer>
          </>
        )}

        {/* Signup Button */}
        <button
          className="bg-black dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium mt-4"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
