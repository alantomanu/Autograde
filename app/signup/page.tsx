import { SignupForm } from "@/components/signup-form";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/auth-options";
import { redirect } from "next/navigation";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const session = await getServerSession(authOptions);

  // If user is already logged in and not in OAuth flow, redirect to home
  if (session && !resolvedSearchParams?.oauth) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignupForm />
    </div>
  );
} 