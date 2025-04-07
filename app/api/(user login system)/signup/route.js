import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      id, // Optional id field for updating existing user
      name,
      address,
      phone,
      employeeId,
      email,
      password,
      department,
      role,
      position,
      salary,
      photo
    } = body;

    const salaryNumber = parseFloat(salary);

    // Check if user exists based on employeeId or email
    let existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ employeeId }, { email }],
      },
    });

    if (existingUser) {
      // If user exists, update their details (password update is conditional)
      const hashedPassword = password 
        ? await bcrypt.hash(password, 10) 
        : existingUser.password;

      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          address,
          phone,
          employeeId,
          email,
          department,
          role,
          position,
          salary: salaryNumber,
          password: hashedPassword, // Update password only if new password is provided
          photo,
        },
      });

      return NextResponse.json(
        { message: "User updated successfully", user: updatedUser },
        { status: 200 }
      );
    } else {
      // If no existing user found, create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name,
          address,
          phone,
          employeeId,
          email,
          department,
          role,
          position,
          salary: salaryNumber,
          password: hashedPassword,
          photo,
        },
      });

      return NextResponse.json(
        { message: "User created successfully", user: newUser },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "User creation failed", details: error.message },
      { status: 406 }
    );
  }
}
