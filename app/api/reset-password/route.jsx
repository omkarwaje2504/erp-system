import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, resetToken, newPassword } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.resetToken !== resetToken || new Date() > user.tokenExpiry) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, resetToken: null, tokenExpiry: null },
    });

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Reset failed", details: error.message }, { status: 500 });
  }
}
