import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
      const centers = await prisma.costCenter.findMany();
      return NextResponse.json({ centers });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  
  export async function POST(req) {
    try {
      const data = await req.json();
      if (data.id) {
        const updated = await prisma.costCenter.update({ where: { id: data.id }, data });
        return NextResponse.json({ message: "Updated", center: updated });
      } else {
        const created = await prisma.costCenter.create({ data });
        return NextResponse.json({ message: "Created", center: created });
      }
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }