import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: Retrieve all payroll data
export async function GET(req) {
  try {
    const payroll = await prisma.payroll.findMany({
      include: {
        employee: true, // To get employee details along with payroll
      },
    });
    return NextResponse.json({ payroll });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch payroll data", details: err.message }, { status: 500 });
  }
}

// POST: Create a new payroll record
export async function POST(req) {
  try {
    const data = await req.json();
    const { employeeId, basicSalary, deductions, bonuses, netSalary, payslipStatus } = data;

    if (!employeeId || !basicSalary || !deductions || !bonuses || !netSalary || !payslipStatus) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newPayroll = await prisma.payroll.create({
      data: {
        employeeId,
        basicSalary,
        deductions,
        bonuses,
        netSalary,
        payslipStatus,
      },
    });

    return NextResponse.json({ message: "Payroll record created", payroll: newPayroll });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create payroll", details: err.message }, { status: 500 });
  }
}

// PUT: Update an existing payroll record
export async function PUT(req) {
  try {
    const data = await req.json();
    const { id, basicSalary, deductions, bonuses, netSalary, payslipStatus } = data;

    if (!id || !basicSalary || !deductions || !bonuses || !netSalary || !payslipStatus) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedPayroll = await prisma.payroll.update({
      where: { id },
      data: {
        basicSalary,
        deductions,
        bonuses,
        netSalary,
        payslipStatus,
      },
    });

    return NextResponse.json({ message: "Payroll updated successfully", payroll: updatedPayroll });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update payroll", details: err.message }, { status: 500 });
  }
}

// DELETE: Delete a payroll record
export async function DELETE(req) {
  try {
    const { id } = req.query;

    if (!id) {
      return NextResponse.json({ error: "Payroll ID is required" }, { status: 400 });
    }

    const deletedPayroll = await prisma.payroll.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Payroll deleted successfully", deletedPayroll });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete payroll", details: err.message }, { status: 500 });
  }
}
