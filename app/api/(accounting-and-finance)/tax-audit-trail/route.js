// app/api/tax-audit-trail/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST: Add new tax audit log
export async function POST(req) {
  try {
    const data = await req.json();
    const { action, user, timestamp } = data;

    if (!action || !user || !timestamp) {
      return NextResponse.json(
        { error: "All fields (action, user, timestamp) are required." },
        { status: 400 }
      );
    }

    const audit = await prisma.taxAudit.create({
      data: {
        action,
        user,
        timestamp: new Date(timestamp),
      },
    });

    return NextResponse.json({ message: "Audit record created", audit });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET: Fetch all audit logs
export async function GET() {
  try {
    const audits = await prisma.taxAudit.findMany({
      orderBy: { timestamp: "desc" },
    });
    return NextResponse.json({ audits });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
