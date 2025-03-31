import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const workstations = await prisma.workstation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ workstations });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      id,
      workstationName,
      assignedTo,
      currentOperation,
      productionTime,
      utilization,
      description,
      documentUrl,
    } = data;

    if (id) {
      const updated = await prisma.workstation.update({
        where: { id },
        data: {
          workstationName,
          assignedTo,
          currentOperation,
          productionTime,
          utilization,
          description,
          documentUrl,
        },
      });
      return NextResponse.json({ message: "Updated", workstation: updated });
    }

    const newWorkstation = await prisma.workstation.create({
      data: {
        workstationName,
        assignedTo,
        currentOperation,
        productionTime,
        utilization,
        description,
        documentUrl,
      },
    });

    return NextResponse.json({
      message: "Created",
      workstation: newWorkstation,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
