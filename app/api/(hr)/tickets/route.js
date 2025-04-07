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
    const { id, employeeId, issueType, description, documentUrl, status } = body;

    if (id) {
      // 🔁 Update existing ticket
      const updated = await prisma.ticket.update({
        where: { id },
        data: {
          status: status || "Pending",
        },
      });
      return NextResponse.json({ message: "Ticket updated", ticket: updated });
    }

    // 🆕 Create new ticket
    if (!ObjectId.isValid(employeeId)) {
      return NextResponse.json({ error: "Invalid employee ID" }, { status: 400 });
    }

    const created = await prisma.ticket.create({
      data: {
        employeeId,
        issueType,
        description,
        documentUrl,
        status: "Pending",
      },
    });

    return NextResponse.json({ message: "Ticket created", ticket: created });
  } catch (error) {
    console.error("Error creating/updating ticket:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
