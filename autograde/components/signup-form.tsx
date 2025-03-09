"use client";

import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  teacherId: string;
}

export function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    teacherId: ""
  });
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
    if (formData.password) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  // Handle manual signup
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isOAuth) {
      if (!formData.email || !formData.password || !formData.teacherId || !formData.confirmPassword) {
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
    console.log("Signup Data:", { ...formData });
  };

  // Handle Google OAuth Signup
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
    setIsOAuth(true); // Set OAuth flag
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
          <Button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full flex items-center justify-center gap-3"
            variant="outline"
          >
            <IconBrandGoogle className="h-5 w-5" />
            Continue with Google
          </Button>
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
            value={formData.email}
            disabled={isOAuth}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="yourname@example.com"
          />
        </LabelInputContainer>

        {/* Teacher ID Field - Required for all */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="teacherId">Teacher ID</Label>
          <Input
            id="teacherId"
            type="text"
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
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
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setPasswordStrength(checkPasswordStrength(e.target.value));
                }}
                placeholder="Enter The Password"
              />
              {formData.password && (
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
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm Your Password"
              />
              {formData.confirmPassword && !passwordsMatch && (
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
