import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const attendanceRecords = await prisma.attendance.findMany();
    return NextResponse.json({ attendanceRecords });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { employeeId, employeeName, checkInTime, checkOutTime, attendanceStatus, totalWorkingHours } = data;

    const createdAttendance = await prisma.attendance.create({
      data: {
        employeeId,
        employeeName,
        checkInTime: new Date(checkInTime),
        checkOutTime: new Date(checkOutTime),
        attendanceStatus,
        totalWorkingHours: parseFloat(totalWorkingHours),
      },
    });

    return NextResponse.json({ message: "Attendance created", attendance: createdAttendance });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const { id, attendanceStatus, totalWorkingHours } = data;

    const updatedAttendance = await prisma.attendance.update({
      where: { id },
      data: {
        attendanceStatus,
        totalWorkingHours: parseFloat(totalWorkingHours),
      },
    });

    return NextResponse.json({ message: "Attendance updated", attendance: updatedAttendance });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = req.query;

    if (!id) {
      return NextResponse.json({ error: "Attendance ID is required" }, { status: 400 });
    }

    const deletedAttendance = await prisma.attendance.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Attendance deleted", deletedAttendance });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
