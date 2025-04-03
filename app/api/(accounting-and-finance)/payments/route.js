import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Create or update payment
export async function POST(req) {
  try {
    const data = await req.json();
    const { id, date, method, amount, invoiceId } = data;

    if (id) {
      const updated = await prisma.payment.update({
        where: { id },
        data: { date, method, amount, invoiceId },
      });
      return NextResponse.json({ message: "Updated", payment: updated });
    }

    const created = await prisma.payment.create({
      data: { date, method, amount, invoiceId },
    });
    return NextResponse.json({ message: "Created", payment: created });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Get all payments
export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { invoice: true },
    });
    return NextResponse.json({ payments });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
