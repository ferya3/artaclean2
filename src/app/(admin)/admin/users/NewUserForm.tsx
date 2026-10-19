"use client";

import { UserPlus } from "lucide-react";
import { useActionState } from "react";

import { createUserAction, type ActionState } from "@/app/(admin)/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function NewUserForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createUserAction, {});

  return (
    <form action={action} className="space-y-4">
      <Field label="نام" required>
        <Input name="name" required />
      </Field>

      <Field label="ایمیل" required>
        <Input name="email" type="email" dir="ltr" autoComplete="off" required />
      </Field>

      <Field label="رمز عبور" required hint="حداقل ۱۰ نویسه.">
        <Input name="password" type="password" dir="ltr" autoComplete="new-password" required />
      </Field>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent-2"
        >
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm">
          {state.message}
        </p>
      )}

      <Button type="submit" variant="primary" block disabled={pending}>
        <UserPlus className="size-4" aria-hidden />
        {pending ? "در حال ساخت…" : "ساخت حساب"}
      </Button>
    </form>
  );
}
