"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "@gravity-ui/icons";
import { FcGoogle } from "react-icons/fc";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/30";

const labelClass = "mb-2 text-sm font-medium text-white/70";

function getDashboardPath(role) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "owner") return "/dashboard/owner";
  return "/dashboard/tenant";
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signIn.email({
      email: user.email,
      password: user.password,
    });

    if (!data) {
      toast.error(error?.message || "Invalid email or password");
      return;
    }

    const role = data.user?.role;
    const destination = redirectTo || getDashboardPath(role);

    toast.success("Logged in successfully!");
    router.push(destination);
    router.refresh();
  };

  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: redirectTo || "/",
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a1a2f] px-4 py-10">
      <Card className="w-full max-w-[500px] border border-white/[0.08] bg-[#0f2a47] px-6 py-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:px-10 sm:py-10">
        <h1 className="mb-2 text-center text-3xl font-semibold tracking-[-0.03em] text-white">
          Login
        </h1>

        <p className="mb-8 text-center text-sm text-white/50">
          Sign in to your Rentora account
        </p>

        <Form className="flex w-full flex-col gap-5" onSubmit={onSubmit}>
          <TextField isRequired name="email" type="email">
            <Label className={labelClass}>Email</Label>
            <Input className={inputClass} placeholder="Enter your email" />
            <FieldError />
          </TextField>

          <TextField isRequired name="password" type="password">
            <Label className={labelClass}>Password</Label>
            <Input
              type="password"
              className={inputClass}
              placeholder="Enter your password"
            />
            <FieldError />
          </TextField>

          <Button
            type="submit"
            className="mt-1 h-12 w-full rounded-xl bg-[#b8893a] text-sm font-semibold text-[#0a1a2f]"
          >
            <Check width={17} height={17} />
            Login
          </Button>

          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[11px] font-medium text-white/30">OR</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <Button
            type="button"
            variant="secondary"
            onPress={handleGoogle}
            className="h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] text-sm font-medium text-white/80"
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>

          <p className="pt-1 text-center text-sm text-white/45">
            New to Rentora?{" "}
            <Link
              href={`/auth/signup?redirect=${encodeURIComponent(redirectTo || "")}`}
              className="font-medium text-[#b8893a] hover:underline"
            >
              Register
            </Link>
          </p>
        </Form>
      </Card>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
