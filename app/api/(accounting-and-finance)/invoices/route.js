import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ---------------------------- INVOICE ----------------------------
export async function GET(req) {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: { payments: true },
    });
    return NextResponse.json({ invoices });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      id,
      invoiceNumber,
      date,
      customerName,
      description,
      amount,
      status,
      type,
    } = data;


    const floatAmount = parseFloat(amount);
    if (isNaN(floatAmount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (id) {
      const updated = await prisma.invoice.update({
        where: { id },
        data: {
          invoiceNumber,
          date,
          customerName,
          description,
          amount: floatAmount,
          status,
          type,
        },
      });
      return NextResponse.json({ message: "Updated", invoice: updated });
    }

    const created = await prisma.invoice.create({
      data: {
        invoiceNumber,
        date,
        customerName,
        description,
        amount: floatAmount,
        status,
        type,
      },
    });
    return NextResponse.json({ message: "Created", invoice: created });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
