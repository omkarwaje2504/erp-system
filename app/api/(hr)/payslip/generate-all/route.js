import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST: Generate payslips for all employees
export async function POST(req) {
  try {
    // Fetch all employees with role 'employee'
    const employees = await prisma.user.findMany({
      where: {
        role: "employee",
      },
    });

    if (employees.length === 0) {
      return NextResponse.json(
        { message: "No employees found with the role 'employee'" },
        { status: 404 }
      );
    }

    const generatedPayslips = [];

    // Generate payslips for each employee
    for (const employee of employees) {
      // Check if a pending payslip already exists for this employee
      const existingPayslip = await prisma.payroll.findFirst({
        where: {
          employeeId: employee.id,
          payslipStatus: "Pending", // Check if a payslip with status "Pending" already exists
        },
      });

      if (existingPayslip) {
        // If a pending payslip exists, skip this employee
        continue;
      }

      // If no pending payslip, generate a new one
      const basicSalary = employee.salary || 0; 
      const deductions = 0; 
      const bonuses = 0; 
      const netSalary = basicSalary - deductions + bonuses;

      // Create the payslip
      const newPayslip = await prisma.payroll.create({
        data: {
          employeeId: employee.id,
          basicSalary,
          deductions,
          bonuses,
          netSalary,
          payslipStatus: "Pending", // Set status to "Pending"
        },
      });

      generatedPayslips.push(newPayslip);
    }

    return NextResponse.json({
      message: "Payslips generated for all employees!",
      payslips: generatedPayslips,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Error generating payslips", details: err.message },
      { status: 500 }
    );
  }
}
