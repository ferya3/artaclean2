"use client";

import { LogIn } from "lucide-react";
import { useActionState } from "react";

import { loginAction, type ActionState } from "@/app/(admin)/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, {});

  return (
    <form action={action} className="space-y-4">
      <Field label="ایمیل" required>
        <Input
          name="email"
          type="email"
          dir="ltr"
          autoComplete="username"
          required
          className="border-white/15 bg-white/8 text-white placeholder:text-white/30"
        />
      </Field>

      <Field label="رمز عبور" required>
        <Input
          name="password"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          required
          className="border-white/15 bg-white/8 text-white placeholder:text-white/30"
        />
      </Field>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent-2"
        >
          {state.error}
        </p>
      )}

      <Button type="submit" variant="accent" block disabled={pending}>
        <LogIn className="size-4" aria-hidden />
        {pending ? "در حال ورود…" : "ورود به پنل"}
      </Button>
    </form>
  );
}
