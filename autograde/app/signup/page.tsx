import { SignupForm } from "@/components/signup-form";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: { oauth?: string }
}) {
  const session = await getServerSession(authOptions);

  // If user is already logged in and not in OAuth flow, redirect to home
  if (session && !searchParams?.oauth) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignupForm />
    </div>
  );
} 