"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";

export function LoginForm() {
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [isOAuth, setIsOAuth] = useState(false);

  // Handle manual login
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isOAuth && (!teacherId || !password)) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log("Login Data:", { teacherId, password });
  };

  // Handle Google OAuth Login
  const handleGoogleLogin = async () => {
    try {
      // Simulating OAuth authentication
      setIsOAuth(true);
      alert("Google OAuth successful!");
    } catch (error) {
      console.error("OAuth Login Failed", error);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Login
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Welcome back! Please login to continue.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* OAuth Button at the top */}
        <div className="flex flex-col space-y-4 mb-8">
          <button
            className="flex items-center space-x-2 justify-center w-full text-black rounded-md h-10 font-medium bg-gray-50 dark:bg-zinc-900"
            type="button"
            onClick={handleGoogleLogin}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span>Sign in with Google</span>
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

        {/* Teacher ID Field */}
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

        {/* Password Field */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </LabelInputContainer>

        {/* Login Button */}
        <button
          className="bg-black dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
          type="submit"
        >
          Login
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