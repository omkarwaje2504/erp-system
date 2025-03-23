import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, address, phone, employeeId, email, password, department } =
      body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ employeeId }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or employee ID already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        address,
        phone,
        employeeId,
        email,
        password: hashedPassword,
        department,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "User creation failed", details: error.message },
      { status: 406 }
    );
  }
}
