import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { employee: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { employeeId, issueType, description, documentUrl } = body;

    if (!ObjectId.isValid(employeeId)) {
      return NextResponse.json({ error: "Invalid employee ID" }, { status: 400 });
    }

    const created = await prisma.ticket.create({
      data: {
        employeeId,
        issueType,
        description,
        documentUrl,
      },
    });

    return NextResponse.json({ message: "Ticket created", ticket: created });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
