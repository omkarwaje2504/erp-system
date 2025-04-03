// app/api/tax-reports/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST: Create new tax report
export async function POST(req) {
  try {
    const data = await req.json();
    const { reportType, period, amount, status } = data;

    if (!reportType || !period || !amount || !status) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const report = await prisma.taxReport.create({
      data: {
        reportType,
        period,
        amount: parseFloat(amount),
        status,
      },
    });

    return NextResponse.json({ message: "Report created", report });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET: Fetch all tax reports
export async function GET() {
  try {
    const reports = await prisma.taxReport.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reports });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
