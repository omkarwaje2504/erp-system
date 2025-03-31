import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  }
});

export async function POST(req) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const resetToken = uuidv4().substring(0, 6); // 6-digit code
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    await prisma.user.update({
      where: { email },
      data: { resetToken, tokenExpiry },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetToken}. It expires in 15 minutes.`,
    });

    return NextResponse.json({ message: "Verification code sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email", details: error.message }, { status: 500 });
  }
}
