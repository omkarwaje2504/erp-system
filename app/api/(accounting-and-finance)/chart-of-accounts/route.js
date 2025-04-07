import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const accounts = await prisma.chartOfAccount.findMany();
    return NextResponse.json({ accounts });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { id, name, type, balance, description, status } = data;

    if (id) {
      const updated = await prisma.chartOfAccount.update({
        where: { id },
        data: {
          name,
          type,
          balance: parseFloat(balance),
          description,
          status,
        },
      });
      return NextResponse.json({ message: "Updated", account: updated });
    }

    const created = await prisma.chartOfAccount.create({
      data: {
        name,
        type,
        balance: parseFloat(balance),
        description,
        status,
      },
    });

    return NextResponse.json({ message: "Created", account: created });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.query;
    if (!id) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }

    const deletedAccount = await prisma.chartOfAccount.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Account deleted successfully", deletedAccount });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
