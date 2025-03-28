import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ customers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch customers", details: error.message },
      { status: 500 }
    );
  }
}
