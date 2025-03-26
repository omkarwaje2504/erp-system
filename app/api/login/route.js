import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        name: true,
        phone: true,
        employeeId: true,
        email: true,
        department: true,
        role: true,
        position: true,
        salary: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    const { password: _, ...safeUser } = user;
    return NextResponse.json(
      { message: "Login successful", user: safeUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Login failed", details: error.message },
      { status: 500 }
    );
  }
}
