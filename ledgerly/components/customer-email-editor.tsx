"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerEmailEditor({
  customerId,
  initialEmail,
}: {
  customerId: string;
  initialEmail: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/customers/${encodeURIComponent(customerId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        setError("Could not save email.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not save email.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Label htmlFor={`customer-email-${customerId}`}>Email</Label>
      <Input
        id={`customer-email-${customerId}`}
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button type="submit" size="sm" disabled={saving}>
        {saving ? "Saving…" : "Save email"}
      </Button>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </form>
  );
}
