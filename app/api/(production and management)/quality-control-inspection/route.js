import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Create or Update Inspection
export async function POST(req) {
  try {
    const data = await req.json();
    const {
      id,
      batchId,
      inspectionStatus,
      defectType,
      assignedTo,
      description,
      documentUrl,
      reworkStatus,
    } = data;

    if (id) {
      const updated = await prisma.inspection.update({
        where: { id },
        data: {
          batchId,
          inspectionStatus,
          defectType,
          assignedTo,
          description,
          documentUrl,
          reworkStatus,
        },
      });

      return NextResponse.json({
        message: "Inspection updated",
        inspection: updated,
      });
    }

    const newInspection = await prisma.inspection.create({
      data: {
        batchId,
        inspectionStatus,
        defectType,
        assignedTo,
        description,
        documentUrl,
        reworkStatus,
      },
    });

    return NextResponse.json({
      message: "Inspection created",
      inspection: newInspection,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Get All Inspections
export async function GET() {
  try {
    const inspections = await prisma.inspection.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ inspections });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
