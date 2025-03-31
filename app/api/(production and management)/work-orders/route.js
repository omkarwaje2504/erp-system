import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      id,
      workOrderName,
      workOrderId,
      assignedTo,
      startDate,
      completionDate,
      efficiency,
      description,
      documentUrl,
      status,
    } = data;

    if (id) {
      const updated = await prisma.workOrder.update({
        where: { id },
        data: {
          workOrderName,
          workOrderId,
          assignedTo,
          startDate,
          completionDate,
          efficiency,
          description,
          documentUrl,
          status,
        },
      });

      return NextResponse.json({ message: "Updated", order: updated });
    }

    const newOrder = await prisma.workOrder.create({
      data: {
        workOrderName,
        workOrderId,
        assignedTo,
        startDate,
        completionDate,
        efficiency,
        description,
        documentUrl,
        status,
      },
    });

    return NextResponse.json({ message: "Created", order: newOrder });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.workOrder.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
