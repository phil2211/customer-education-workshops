import { NextResponse } from "next/server";
import { updateCustomerEmail } from "@/lib/data";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Email must be a string" }, { status: 400 });
  }

  const email =
    body && typeof body === "object" && "email" in body ? (body as { email: unknown }).email : undefined;
  if (typeof email !== "string") {
    return NextResponse.json({ error: "Email must be a string" }, { status: 400 });
  }

  const customer = await updateCustomerEmail(id, email);
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({ customer });
}
