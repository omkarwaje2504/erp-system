import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const leaveRequests = await prisma.leaveRequest.findMany();
    return NextResponse.json({ leaveRequests });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { employeeId, employeeName, leaveType, startDate, endDate, reasonForLeave } = data;

    const createdLeaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId,
        employeeName,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reasonForLeave,
        status: "pending",  // default status is pending
      },
    });

    return NextResponse.json({ message: "Leave request created", leaveRequest: createdLeaveRequest });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const { id, status } = data;

    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ message: "Leave request updated", leaveRequest: updatedLeaveRequest });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = req.query;

    if (!id) {
      return NextResponse.json({ error: "Leave request ID is required" }, { status: 400 });
    }

    const deletedLeaveRequest = await prisma.leaveRequest.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Leave request deleted", deletedLeaveRequest });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
