"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "@gravity-ui/icons";
import { FcGoogle } from "react-icons/fc";
import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Radio,
  RadioGroup,
  TextField,
} from "@heroui/react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/30";
const labelClass = "mb-2 text-sm font-medium text-white/70";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());
    console.log(user,"signup user");

    const { data, error } = await authClient.signUp.email({
      name: user?.name,
      image: user?.image,
      email: user?.email,
      password: user?.password,
      role: user?.role,
    });

    if (!data) {
      toast.error(error?.message || "Sign up failed");
      return;
    }
    toast.success("Account created successfully!");
    router.push(redirectTo);
    router.refresh();
  };

  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: redirectTo,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a1a2f] px-4 py-10">
      <Card className="w-full max-w-[500px] border border-white/[0.08] bg-[#0f2a47] px-6 py-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:px-10 sm:py-10">
        <h1 className="mb-2 text-center text-3xl font-semibold tracking-[-0.03em] text-white">
          Sign Up
        </h1>
        <p className="mb-8 text-center text-sm text-white/50">
          Join RentNest as a tenant or property owner
        </p>

        <Form className="flex w-full flex-col gap-5" onSubmit={onSubmit}>
          {/* Name */}
          <TextField isRequired name="name" type="text">
            <Label className={labelClass}>Name</Label>
            <Input className={inputClass} placeholder="Enter your name" />
            <FieldError />
          </TextField>

          {/* Image */}
          <TextField isRequired name="image" type="url">
            <Label className={labelClass}>Image URL</Label>
            <Input className={inputClass} placeholder="Image URL" />
            <FieldError />
          </TextField>

          {/* Email */}
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className={labelClass}>Email</Label>
            <Input className={inputClass} placeholder="Enter your email" />
            <FieldError />
          </TextField>

          {/* Password */}
          <TextField
            isRequired
            minLength={8}
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label className={labelClass}>Password</Label>
            <Input
              type="password"
              className={inputClass}
              placeholder="Enter your password"
            />
            <Description className="mt-1 text-xs text-white/40">
              Must be at least 8 characters with 1 uppercase and 1 number
            </Description>
            <FieldError />
          </TextField>

          {/* Role */}
          <div className="flex flex-col gap-4">
            <Label className="text-sm font-medium text-white/70">I am a</Label>
            <RadioGroup
              defaultValue="tenant"
              name="role"
              orientation="horizontal"
            >
              <Radio value="tenant">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <span className="text-white">Tenant</span>
                </Radio.Content>
              </Radio>
              <Radio value="owner">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <span className="text-white">Owner</span>
                </Radio.Content>
              </Radio>
            </RadioGroup>
          </div>

          {/* Submit + Reset */}
          <div className="mt-1 flex gap-3">
            <Button
              type="submit"
              className="h-12 flex-1 rounded-xl bg-[#b8893a] text-sm font-semibold text-[#0a1a2f]"
            >
              <Check width={17} height={17} />
              Submit
            </Button>

            <Button
              type="reset"
              variant="secondary"
              className="h-12 rounded-xl border border-white/[0.09] bg-white/[0.04] px-6 text-sm text-white/60"
            >
              Reset
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[11px] font-medium text-white/30">OR</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="secondary"
            onPress={handleGoogle}
            className="h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] text-sm font-medium text-white/80"
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>

          {/* Login */}
          <p className="pt-1 text-center text-sm text-white/45">
            Already have an account?{" "}
            <Link
              href={`/auth/signin?redirect=${encodeURIComponent(redirectTo)}`}
              className="font-medium text-[#b8893a] hover:underline"
            >
              Login
            </Link>
          </p>
        </Form>
      </Card>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}