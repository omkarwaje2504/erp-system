import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    NextResponse.json(users);
  } catch (error) {
    NextResponse.json({
      error: "Failed to fetch users",
      details: error.message,
    });
  }
}
