import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
      const categories = await prisma.taxCategory.findMany();
      return NextResponse.json({ categories });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  
  export async function POST(req) {
    try {
      const data = await req.json();
      if (data.id) {
        const updated = await prisma.taxCategory.update({ where: { id: data.id }, data });
        return NextResponse.json({ message: "Updated", category: updated });
      } else {
        const created = await prisma.taxCategory.create({ data });
        return NextResponse.json({ message: "Created", category: created });
      }
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }